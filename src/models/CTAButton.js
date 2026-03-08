const mongoose = require("mongoose");

const ctaButtonSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
    },
    link: {
      type: String,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

const CTAButton = mongoose.model("CTAButton", ctaButtonSchema);
module.exports = CTAButton;
