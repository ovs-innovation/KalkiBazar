/* eslint-disable no-console */
require("dotenv").config();
const mongoose = require("mongoose");
const Product = require("../models/Product");
const Category = require("../models/Category");

const normalizeTaxPayload = (payload = {}) => {
  const parsedRate =
    typeof payload.taxRate === "number"
      ? payload.taxRate
      : Number(payload.taxRate);
  return {
    taxRate: Number.isFinite(parsedRate) ? parsedRate : 0,
    hsnCode:
      typeof payload.hsnCode === "string" ? payload.hsnCode.trim() : "",
    isPriceInclusive: Boolean(payload.isPriceInclusive),
  };
};

const DEFAULT_NON_HERBAL = {
  taxRate: 0,
  hsnCode: "",
  isPriceInclusive: false,
};

const DEFAULT_HERBAL = {
  taxRate: 18,
  hsnCode: "3305",
  isPriceInclusive: false,
};

const missingFieldSelector = {
  $or: [
    { taxRate: { $exists: false } },
    { hsnCode: { $exists: false } },
    { isPriceInclusive: { $exists: false } },
  ],
};

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  console.log("🔍 Looking for herbal categories…");
  const herbalCategories = await Category.find({
    "name.en": { $regex: "herbal", $options: "i" },
  }).select("_id name");
  const herbalIds = new Set(
    herbalCategories.map((cat) => cat._id.toString())
  );
  console.log(`🌿 Herbal categories detected: ${herbalCategories.length}`);

  const products = await Product.find(missingFieldSelector).select(
    "_id category taxRate hsnCode isPriceInclusive"
  );

  if (!products.length) {
    console.log("✅ No products are missing GST fields. All good!");
    return mongoose.connection.close();
  }

  console.log(
    `⚠️  Found ${products.length} products missing GST metadata. Applying defaults…`
  );

  const bulkOps = products.reduce((ops, product) => {
    const updateDoc = {};
    const isHerbal =
      herbalIds.has(String(product.category)) ||
      (Array.isArray(product.categories) &&
        product.categories.some((catId) =>
          herbalIds.has(String(catId))
        ));
    const defaults = isHerbal ? DEFAULT_HERBAL : DEFAULT_NON_HERBAL;

    if (product.taxRate === undefined) {
      updateDoc.taxRate = defaults.taxRate;
    }
    if (product.hsnCode === undefined) {
      updateDoc.hsnCode = defaults.hsnCode;
    }
    if (product.isPriceInclusive === undefined) {
      updateDoc.isPriceInclusive = defaults.isPriceInclusive;
    }

    if (Object.keys(updateDoc).length) {
      const normalized = normalizeTaxPayload(updateDoc);
      ops.push({
        updateOne: {
          filter: { _id: product._id },
          update: { $set: normalized },
        },
      });
    }
    return ops;
  }, []);

  if (!bulkOps.length) {
    console.log("✅ Nothing to update after normalization.");
    return mongoose.connection.close();
  }

  const result = await Product.bulkWrite(bulkOps);
  console.log(`🎉 Updated ${result.modifiedCount} products with GST defaults.`);
  mongoose.connection.close();
};

run().catch((err) => {
  console.error("❌ GST backfill failed:", err);
  mongoose.connection.close();
  process.exit(1);
});

