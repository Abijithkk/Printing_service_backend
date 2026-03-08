const express = require("express");
const { protect, admin } = require("../../middlewares/authMiddleware");
const {
  getQuickActions,
  createQuickAction,
  updateQuickAction,
  deleteQuickAction,
  toggleQuickActionStatus,
  reorderQuickActions,
} = require("../../controllers/admin/quickActionController");

const router = express.Router();

router
  .route("/")
  .get(protect, admin, getQuickActions)
  .post(protect, admin, createQuickAction);

router.put("/reorder", protect, admin, reorderQuickActions);

router
  .route("/:id")
  .put(protect, admin, updateQuickAction)
  .delete(protect, admin, deleteQuickAction);

router.patch("/:id/toggle-active", protect, admin, toggleQuickActionStatus);

module.exports = router;
