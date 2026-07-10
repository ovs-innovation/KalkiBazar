const express = require("express");
const router = express.Router();

const {
  createOrUpdateReview,
  getProductReviews,
  markReviewHelpful,
  deleteReview,
  getAllReviews,
} = require("../controller/reviewController");
const { isAuth } = require("../config/auth");

// Admin: Get all reviews
router.get("/admin/all", isAuth, getAllReviews);

// Create or update a review for a product
router.post("/", isAuth, createOrUpdateReview);

// Get reviews + rating summary for a product
router.get("/:productId", getProductReviews);

// Mark review as helpful
router.put("/:reviewId/helpful", isAuth, markReviewHelpful);

// Delete a review (review owner or admin)
router.delete("/:reviewId", isAuth, deleteReview);

module.exports = router;


