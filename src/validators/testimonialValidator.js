const Joi = require("joi");

const createTestimonialSchema = Joi.object({
  name: Joi.string().required(),
  content: Joi.string().required(),
  rating: Joi.number().min(1).max(5).required(),
  isActive: Joi.boolean().optional(),
});

const updateTestimonialSchema = Joi.object({
  name: Joi.string().optional(),
  content: Joi.string().optional(),
  rating: Joi.number().min(1).max(5).optional(),
  isActive: Joi.boolean().optional(),
});

module.exports = {
  createTestimonialSchema,
  updateTestimonialSchema,
};
