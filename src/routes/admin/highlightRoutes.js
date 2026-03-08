const express = require("express");
const { protect, admin } = require("../../middlewares/authMiddleware");
const { uploadHighlightIcon } = require("../../middlewares/uploadMiddleware");
const {
  getHighlights,
  createHighlight,
  updateHighlight,
  deleteHighlight,
  toggleHighlightStatus,
  reorderHighlights,
} = require("../../controllers/admin/highlightController");

const router = express.Router();

router
  .route("/")
  .get(protect, admin, getHighlights)
  .post(protect, admin, uploadHighlightIcon, createHighlight);

router.put("/reorder", protect, admin, reorderHighlights);

router
  .route("/:id")
  .put(protect, admin, uploadHighlightIcon, updateHighlight)
  .delete(protect, admin, deleteHighlight);

router.patch("/:id/toggle-active", protect, admin, toggleHighlightStatus);

module.exports = router;
