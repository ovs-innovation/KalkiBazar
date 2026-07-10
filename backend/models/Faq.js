const mongoose = require("mongoose");

const faqSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["qa", "video"],
      default: "qa",
    },
    question: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },
    answer: {
      type: String,
      required: false,
      trim: true,
      maxlength: 5000,
    },
    videoUrl: {
      type: String,
      trim: true,
    },
    chatLink: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ["published", "draft"],
      default: "published",
    },
    sortOrder: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

faqSchema.index({ sortOrder: 1, createdAt: -1 });

module.exports = mongoose.model("Faq", faqSchema);


