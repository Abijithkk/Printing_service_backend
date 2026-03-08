const express = require("express");

const router = express.Router();

router.use("/header/navigation", require("./navigationRoutes"));
router.use("/header/cta", require("./ctaButtonRoutes"));
router.use("/hero", require("./heroRoutes"));
router.use("/site-settings", require("./settingsRoutes"));
router.use("/highlights", require("./highlightRoutes"));
router.use("/categories", require("./categoryRoutes"));
router.use("/services", require("./serviceRoutes"));
router.use("/testimonials", require("./testimonialRoutes"));
router.use("/quick-actions", require("./quickActionRoutes"));
router.use("/newsletter", require("./newsletterRoutes"));

module.exports = router;
