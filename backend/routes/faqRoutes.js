const express = require("express");
const router = express.Router();
const {
  createFaq,
  getPublicFaqs,
  getAllFaqs,
  getFaqById,
  updateFaq,
  deleteFaq,
} = require("../controller/faqController");
const { isAuth } = require("../config/auth");

// Public FAQs for storefront
router.get("/", getPublicFaqs);

// Admin listing
router.get("/admin/all", isAuth, getAllFaqs);
router.get("/:id", isAuth, getFaqById);
router.post("/", isAuth, createFaq);
router.put("/:id", isAuth, updateFaq);
router.delete("/:id", isAuth, deleteFaq);

module.exports = router;


