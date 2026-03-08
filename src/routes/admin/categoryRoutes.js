const express = require("express");
const { protect, admin } = require("../../middlewares/authMiddleware");
const { uploadCategoryImage } = require("../../middlewares/uploadMiddleware");
const {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  toggleCategoryStatus,
  reorderCategories,
} = require("../../controllers/admin/categoryController");

const router = express.Router();

router
  .route("/")
  .get(protect, admin, getCategories)
  .post(protect, admin, uploadCategoryImage, createCategory);

router.put("/reorder", protect, admin, reorderCategories);

router
  .route("/:id")
  .get(protect, admin, getCategoryById)
  .put(protect, admin, uploadCategoryImage, updateCategory)
  .delete(protect, admin, deleteCategory);

router.patch("/:id/toggle-active", protect, admin, toggleCategoryStatus);

module.exports = router;
