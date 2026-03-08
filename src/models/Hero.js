const mongoose = require("mongoose");

const heroSectionSchema = new mongoose.Schema({
  headline: {
    type: String,
    required: true,
  },
  subtext: {
    type: String,
    required: true,
  },
  ctaText: {
    type: String,
    required: true,
  },
  ctaLink: {
    type: String,
    required: true,
  },
  backgroundImage: {
    type: String,
    required: false,
    default: "",
  },

});

const heroSchema = new mongoose.Schema(
  {
    sections: [heroSectionSchema],
  },
  { timestamps: true },
);

module.exports = mongoose.model("Hero", heroSchema);
