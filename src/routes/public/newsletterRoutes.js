const express = require("express");
const {
  subscribeNewsletter,
} = require("../../controllers/public/publicController");

const router = express.Router();

router.post("/", subscribeNewsletter);

module.exports = router;
