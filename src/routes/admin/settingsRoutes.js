const express = require("express");
const { protect, admin } = require("../../middlewares/authMiddleware");
const { uploadLogo, uploadSocialMediaIcon } = require("../../middlewares/uploadMiddleware");
const {
  getSiteSettings,
  updateLogo,
  updateContactDetails,
  updateFooterText,
  addSocialMediaLink,
  updateSocialMediaLink,
  deleteSocialMediaLink,
  updateHeaderCTA,
} = require("../../controllers/admin/settingsController");

const router = express.Router();

const handleUpload = (req, res, next) => {
  uploadLogo(req, res, (err) => {
    if (err) return res.status(400).json({ success: false, message: err.message });
    next();
  });
};

const handleSocialMediaIconUpload = (req, res, next) => {
  uploadSocialMediaIcon(req, res, (err) => {
    if (err) return res.status(400).json({ success: false, message: err.message });
    next();
  });
};

router.get("/", protect, admin, getSiteSettings);
router.put("/logo", protect, admin, handleUpload, updateLogo);
router.put("/contact", protect, admin, updateContactDetails);
router.put("/footer", protect, admin, updateFooterText);
router.post("/social-media", protect, admin, handleSocialMediaIconUpload, addSocialMediaLink);
router.put("/social-media/:id", protect, admin, handleSocialMediaIconUpload, updateSocialMediaLink);
router.delete("/social-media/:id", protect, admin, deleteSocialMediaLink);

// allow editing of the single header CTA text/link stored in site settings
router.put("/header-cta", protect, admin, updateHeaderCTA);

module.exports = router;
