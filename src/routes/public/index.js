const express = require("express");
const router = express.Router();

const homeRoutes = require("./homeRoutes");
const newsletterRoutes = require("./newsletterRoutes");

router.use("/home", homeRoutes);
router.use("/newsletter", newsletterRoutes);

module.exports = router;
