const express = require("express");
const { getHomeData } = require("../../controllers/public/publicController");

const router = express.Router();

router.get("/", getHomeData);

module.exports = router;
