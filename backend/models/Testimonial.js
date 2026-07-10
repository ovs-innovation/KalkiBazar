const mongoose = require("mongoose");

const testimonialSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    video: {
      type: String,
      required: true,
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

testimonialSchema.index({ sortOrder: 1, createdAt: -1 });

module.exports = mongoose.model("Testimonial", testimonialSchema);

