const express = require("express");
const { protect, admin } = require("../../middlewares/authMiddleware");
const {
  getTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
  toggleTestimonialStatus,
} = require("../../controllers/admin/testimonialController");

const router = express.Router();

router
  .route("/")
  .get(protect, admin, getTestimonials)
  .post(protect, admin, createTestimonial);

router
  .route("/:id")
  .put(protect, admin, updateTestimonial)
  .delete(protect, admin, deleteTestimonial);

router.patch("/:id/toggle-active", protect, admin, toggleTestimonialStatus);

module.exports = router;
