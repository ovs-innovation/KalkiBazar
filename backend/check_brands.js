const mongoose = require('mongoose');
require('dotenv').config({ path: './.env' });

const BrandSchema = new mongoose.Schema({
  name: Object,
  logo: String,
  coverImage: String,
  status: String,
});

async function check() {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/farmcy_kart');
    console.log('Connected to DB');

    const Brand = mongoose.model('Brand', BrandSchema);
    const brands = await Brand.find({});

    console.log(`Total brands: ${brands.length}`);
    brands.forEach(b => {
      console.log(`Brand: ${b.name?.en || b.name} | Logo: ${b.logo} | Cover: ${b.coverImage} | Status: ${b.status}`);
    });

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

check();
