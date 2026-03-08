const Joi = require("joi");

const createHighlightSchema = Joi.object({
  title: Joi.string().required(),
  order: Joi.number().optional(),
  isActive: Joi.boolean().optional(),
});

const updateHighlightSchema = Joi.object({
  title: Joi.string().optional(),
  order: Joi.number().optional(),
  isActive: Joi.boolean().optional(),
});

const reorderHighlightsSchema = Joi.object({
  items: Joi.array()
    .items(
      Joi.object({
        id: Joi.string().required(),
        order: Joi.number().required(),
      }),
    )
    .min(1)
    .required(),
});

module.exports = {
  createHighlightSchema,
  updateHighlightSchema,
  reorderHighlightsSchema,
};
