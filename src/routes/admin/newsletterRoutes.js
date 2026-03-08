const express = require("express");
const { protect, admin } = require("../../middlewares/authMiddleware");
const {
  getSubscribers,
} = require("../../controllers/admin/newsletterController");

const router = express.Router();

router.get("/", protect, admin, getSubscribers);

module.exports = router;
