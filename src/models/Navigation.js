const mongoose = require("mongoose");

const navigationSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    order: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

const Navigation = mongoose.model("Navigation", navigationSchema);
module.exports = Navigation;
