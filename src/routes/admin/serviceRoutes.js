const express = require("express");
const { protect, admin } = require("../../middlewares/authMiddleware");
const { uploadServiceImage } = require("../../middlewares/uploadMiddleware");
const {
  getServices,
  createService,
  updateService,
  deleteService,
  toggleServiceStatus,
  reorderServices,
} = require("../../controllers/admin/serviceController");

const router = express.Router();

router
  .route("/")
  .get(protect, admin, getServices)
  .post(protect, admin, uploadServiceImage, createService);

router.put("/reorder", protect, admin, reorderServices);

router
  .route("/:id")
  .put(protect, admin, uploadServiceImage, updateService)
  .delete(protect, admin, deleteService);

router.patch("/:id/toggle-active", protect, admin, toggleServiceStatus);

module.exports = router;
