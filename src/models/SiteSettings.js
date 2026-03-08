const mongoose = require("mongoose");

const socialMediaSchema = new mongoose.Schema(
  {
    icon: {
      type: String,
      required: true,
    },
    link: {
      type: String,
      required: true,
    },
  },
  { _id: true },
);

const siteSettingsSchema = new mongoose.Schema(
  {
    logo: {
      type: String,
      default: "",
    },
    contactEmail: {
      type: String,
      default: "",
    },
    phoneNumber: {
      type: String,
      default: "",
    },
    officeAddress: {
      type: String,
      default: "",
    },
    footerText: {
      type: String,
      default: "",
    },
    headerCTA: {
      text: {
        type: String,
        default: "",
      },
      link: {
        type: String,
        default: "",
      },
    },
    socialMedia: {
      type: [socialMediaSchema],
      default: [],
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("SiteSettings", siteSettingsSchema);
