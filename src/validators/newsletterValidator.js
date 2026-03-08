const Joi = require("joi");

const subscribeSchema = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  email: Joi.string().email().required(),
});

module.exports = {
  subscribeSchema,
};
