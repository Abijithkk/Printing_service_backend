const Joi = require("joi");

const createCategorySchema = Joi.object({
  title: Joi.string().required(),
  order: Joi.number().optional(),
  isActive: Joi.boolean().optional(),
});

const updateCategorySchema = Joi.object({
  title: Joi.string().optional(),
  order: Joi.number().optional(),
  isActive: Joi.boolean().optional(),
});

const reorderCategoriesSchema = Joi.object({
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
  createCategorySchema,
  updateCategorySchema,
  reorderCategoriesSchema,
};
