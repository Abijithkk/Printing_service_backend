const SiteSettings = require("../../models/SiteSettings");
const Navigation = require("../../models/Navigation");
const Newsletter = require("../../models/Newsletter");
const Hero = require("../../models/Hero");
const Highlight = require("../../models/Highlight");
const QuickAction = require("../../models/QuickAction");
const Service = require("../../models/Service");
const Testimonial = require("../../models/Testimonial");
const Category = require("../../models/Category");
const CTAButton = require("../../models/CTAButton");
const { sendSuccess, sendError } = require("../../utils/apiResponse");
const { subscribeSchema } = require("../../validators/newsletterValidator");


// helper used within public endpoints to ensure any stored path gets a full URL
const addBaseUrl = (req, value) => {
  if (!value || typeof value !== "string") return value;
  if (/^https?:\/\//.test(value)) return value;
  return `${req.protocol}://${req.get("host")}${value}`;
};

const prefixMediaUrls = (req, doc) => {
  if (!doc) return doc;
  const obj = doc.toObject ? doc.toObject() : doc;

  if (obj.icon) obj.icon = addBaseUrl(req, obj.icon);
  if (obj.image) obj.image = addBaseUrl(req, obj.image);

  // hero sections may have backgroundImage
  if (obj.sections && Array.isArray(obj.sections)) {
    obj.sections = obj.sections.map((section) => {
      if (section.backgroundImage) {
        section.backgroundImage = addBaseUrl(req, section.backgroundImage);
      }
      return section;
    });
  }

  return obj;
};

const getHomeData = async (req, res) => {
  try {
    const settings = (await SiteSettings.findOne()) || {};
    const navigation =
      (await Navigation.find({ isActive: true }).sort("order")) || [];
    // pull CTA buttons separately (not included inside header)
    const ctaButtons = await CTAButton.find({ isActive: true }).sort("-createdAt");
    // no CTA items returned inside header; quickActions are separate
    const hero = prefixMediaUrls(req, (await Hero.findOne()) || {});
    const highlights =
      ((await Highlight.find({ isActive: true }).sort("order")) || []).map(
        (h) => prefixMediaUrls(req, h),
      );
    const quickActions =
      (await QuickAction.find({ isActive: true }).sort("order")) || [];
    const services =
      ((await Service.find({ isActive: true }).sort("order")) || []).map(
        (s) => prefixMediaUrls(req, s),
      );
    const testimonials = (await Testimonial.find({ isActive: true })) || [];
    const categories =
      ((await Category.find({ isActive: true }).sort("order")) || []).map(
        (c) => prefixMediaUrls(req, c),
      );

    return sendSuccess(res, "Home data fetched successfully", {
      settings,
      header: {
        navigation,
      },
      quickActions,
      ctaButtons,
      hero,
      highlights,
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
