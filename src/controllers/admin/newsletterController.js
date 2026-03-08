const Newsletter = require("../../models/Newsletter");
const { sendSuccess, sendError } = require("../../utils/apiResponse");

const getSubscribers = async (req, res) => {
  try {
    const subscribers = await Newsletter.find().sort("-createdAt");
    return sendSuccess(res, "Subscribers fetched successfully", subscribers);
  } catch (error) {
    return sendError(res, "Server error", { details: error.message });
  }
};

module.exports = {
  getSubscribers,
};
