const express = require("express");
const { protect, admin } = require("../../middlewares/authMiddleware");
const {
  getNavigationItems,
  createNavigationItem,
  updateNavigationItem,
  deleteNavigationItem,
  toggleActiveNavigationItem,
  reorderNavigationItems,
} = require("../../controllers/admin/headerController");

const router = express.Router();

router
  .route("/")
  .get(protect, admin, getNavigationItems)
  .post(protect, admin, createNavigationItem);

router.put("/reorder", protect, admin, reorderNavigationItems);

router
  .route("/:id")
  .put(protect, admin, updateNavigationItem)
  .delete(protect, admin, deleteNavigationItem);

router.patch("/:id/toggle-active", protect, admin, toggleActiveNavigationItem);

module.exports = router;
