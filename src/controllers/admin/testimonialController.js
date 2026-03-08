const Testimonial = require("../../models/Testimonial");
const { sendSuccess, sendError } = require("../../utils/apiResponse");
const {
  createTestimonialSchema,
  updateTestimonialSchema,
} = require("../../validators/testimonialValidator");

const getTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find().sort("-createdAt");
    return sendSuccess(res, "Testimonials fetched successfully", testimonials);
  } catch (error) {
    return sendError(res, "Server error", { details: error.message });
  }
};

const createTestimonial = async (req, res) => {
  try {
    const { error } = createTestimonialSchema.validate(req.body);
    if (error) {
      return sendError(res, error.details[0].message, null, 400);
    }

    const testimonial = new Testimonial(req.body);
    await testimonial.save();

    return sendSuccess(
      res,
      "Testimonial created successfully",
      testimonial,
      201,
    );
  } catch (error) {
    return sendError(res, "Server error", { details: error.message });
  }
};

const updateTestimonial = async (req, res) => {
  try {
    const { error } = updateTestimonialSchema.validate(req.body);
    if (error) {
      return sendError(res, error.details[0].message, null, 400);
    }

    const testimonial = await Testimonial.findById(req.params.id);
    if (!testimonial) {
      return sendError(res, "Testimonial not found", null, 404);
    }

    Object.assign(testimonial, req.body);
    await testimonial.save();

    return sendSuccess(res, "Testimonial updated successfully", testimonial);
  } catch (error) {
    return sendError(res, "Server error", { details: error.message });
  }
};

const deleteTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);
    if (!testimonial) {
      return sendError(res, "Testimonial not found", null, 404);
    }

    await testimonial.deleteOne();
    return sendSuccess(res, "Testimonial deleted successfully");
  } catch (error) {
    return sendError(res, "Server error", { details: error.message });
  }
};

const toggleTestimonialStatus = async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);
    if (!testimonial) {
      return sendError(res, "Testimonial not found", null, 404);
    }

    testimonial.isActive = !testimonial.isActive;
    await testimonial.save();

    return sendSuccess(
      res,
      "Testimonial status toggled successfully",
      testimonial,
    );
  } catch (error) {
    return sendError(res, "Server error", { details: error.message });
  }
};

module.exports = {
  getTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
  toggleTestimonialStatus,
};
