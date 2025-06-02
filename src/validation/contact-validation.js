import Joi from "joi";

const createContactValidation = Joi.object({
  first_name: Joi.string().max(100).required(),
  last_name: Joi.string().max(100).optional(),
  email: Joi.string().email().max(100).optional(),
  phone: Joi.string().max(20).optional(),
});

const updateContactValidation = Joi.object({
  first_name: Joi.string().max(100).optional(),
  last_name: Joi.string().max(100).optional(),
  email: Joi.string().email().max(100).optional(),
  phone: Joi.string().max(20).optional(),
});

export { createContactValidation, updateContactValidation };
