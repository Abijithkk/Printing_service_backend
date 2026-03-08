const Joi = require("joi");

const createServiceSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  link: Joi.string().required(),
  order: Joi.number().optional(),
  isActive: Joi.boolean().optional(),
});

const updateServiceSchema = Joi.object({
  title: Joi.string().optional(),
  description: Joi.string().optional(),
  link: Joi.string().optional(),
  order: Joi.number().optional(),
  isActive: Joi.boolean().optional(),
});

const reorderServicesSchema = Joi.object({
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
  createServiceSchema,
  updateServiceSchema,
  reorderServicesSchema,
};
