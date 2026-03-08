const SiteSettings = require("../../models/SiteSettings");
const Navigation = require("../../models/Navigation");
const CTAButton = require("../../models/CTAButton");
const Newsletter = require("../../models/Newsletter");
const Hero = require("../../models/Hero");
const Highlight = require("../../models/Highlight");
const QuickAction = require("../../models/QuickAction");
const Service = require("../../models/Service");
const Testimonial = require("../../models/Testimonial");
const Category = require("../../models/Category");
const { sendSuccess, sendError } = require("../../utils/apiResponse");
const { subscribeSchema } = require("../../validators/newsletterValidator");

const getHomeData = async (req, res) => {
  try {
    const settings = (await SiteSettings.findOne()) || {};
    const navigation =
      (await Navigation.find({ isActive: true }).sort("order")) || [];
    const ctaButton = (await CTAButton.findOne()) || {};
    const hero = (await Hero.findOne()) || {};
    const highlights =
      (await Highlight.find({ isActive: true }).sort("order")) || [];
    const quickActions =
      (await QuickAction.find({ isActive: true }).sort("order")) || [];
    const services =
      (await Service.find({ isActive: true }).sort("order")) || [];
    const testimonials = (await Testimonial.find({ isActive: true })) || [];
    const categories =
      (await Category.find({ isActive: true }).sort("order")) || [];

    return sendSuccess(res, "Home data fetched successfully", {
      settings,
      header: {
        navigation,
        ctaButton,
      },
      hero,
      highlights,
      quickActions,
      services,
      testimonials,
      categories,
    });
  } catch (error) {
    return sendError(res, "Server error", { details: error.message }, 500);
  }
};

const subscribeNewsletter = async (req, res) => {
  try {
    const { error } = subscribeSchema.validate(req.body);
    if (error) {
      return sendError(res, error.details[0].message, null, 400);
    }

    const { email, firstName, lastName } = req.body;

    const existingSubscriber = await Newsletter.findOne({ email });
    if (existingSubscriber) {
      return sendError(res, "This email is already subscribed", null, 400);
    }

    const newSubscriber = await Newsletter.create({
      email,
      firstName,
      lastName,
    });
    return sendSuccess(
      res,
      "Subscribed successfully",
      { subscriber: newSubscriber },
      201,
    );
  } catch (error) {
    return sendError(res, "Server error", { details: error.message }, 500);
  }
};

module.exports = {
  getHomeData,
  subscribeNewsletter,
};
