const express = require("express");
const { protect, admin } = require("../../middlewares/authMiddleware");
const {
  getHero,
  createHero,
  updateHero,
  deleteHero,
} = require("../../controllers/admin/heroController");
const { uploadHeroImage } = require("../../middlewares/uploadMiddleware");

const router = express.Router();

router
  .route("/")
  .get(protect, admin, getHero)
  .post(protect, admin, uploadHeroImage, createHero);

router
  .route("/:sectionId")
  .put(protect, admin, uploadHeroImage, updateHero)
  .delete(protect, admin, deleteHero);

module.exports = router;
