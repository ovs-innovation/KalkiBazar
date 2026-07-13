const router = require("express").Router();
const {
  addRefundReason,
  getRefundData,
  updateRefundReason,
  updateReasonStatus,
  updateRefundMode,
  deleteRefundReason,
} = require("../controller/refundController");
const { isAuth, isAdmin } = require("../config/auth"); // <-- 1. Import isAuth here

// 2. Change isAdmin to isAuth so logged-in customers can fetch this data too
router.get("/all", isAuth, getRefundData);

// Keep these protected for admins only
router.post("/add", isAdmin, addRefundReason);
router.put("/:id", isAdmin, updateRefundReason);
router.put("/status/:id", isAdmin, updateReasonStatus);
router.put("/mode/update", isAdmin, updateRefundMode);
router.delete("/:id", isAdmin, deleteRefundReason);

module.exports = router;