const express = require("express");
const { protect, admin } = require("../../middlewares/authMiddleware");
const {
  getCTAButtons,
  createCTAButton,
  getCTAButtonById,
  updateCTAButtonById,
  deleteCTAButton,
  toggleCTAButtonStatus,
} = require("../../controllers/admin/headerController");

const router = express.Router();

router
  .route("/")
  .get(protect, admin, getCTAButtons)
  .post(protect, admin, createCTAButton);

router
  .route("/:id")
  .get(protect, admin, getCTAButtonById)
  .put(protect, admin, updateCTAButtonById)
  .delete(protect, admin, deleteCTAButton);

router.patch("/:id/toggle-active", protect, admin, toggleCTAButtonStatus);

module.exports = router;
