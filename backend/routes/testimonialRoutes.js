const express = require("express");
const router = express.Router();
const {
  createTestimonial,
  getPublicTestimonials,
  getAllTestimonials,
  getTestimonialById,
  updateTestimonial,
  deleteTestimonial,
} = require("../controller/testimonialController");
const { isAuth } = require("../config/auth");

// Public testimonials for storefront
router.get("/", getPublicTestimonials);

// Admin listing
router.get("/admin/all", isAuth, getAllTestimonials);

// Get single testimonial
router.get("/:id", isAuth, getTestimonialById);

// Create testimonial
router.post("/", isAuth, createTestimonial);

// Update testimonial
router.put("/:id", isAuth, updateTestimonial);

// Delete testimonial
router.delete("/:id", isAuth, deleteTestimonial);

module.exports = router;

