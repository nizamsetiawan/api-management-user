import Joi from "joi";

// Validasi untuk membuat alamat baru
const createAddressValidation = Joi.object({
  street: Joi.string().max(100).optional(),
  city: Joi.string().max(100).optional(),
  province: Joi.string().max(100).optional(),
  postal_code: Joi.string().max(20).required(),
  country: Joi.string().max(100).required(),
});

// Validasi untuk mengupdate alamat
const updateAddressValidation = Joi.object({
  street: Joi.string().max(100).optional(),
  city: Joi.string().max(100).optional(),
  province: Joi.string().max(100).optional(),
  postal_code: Joi.string().max(20).optional(),
  country: Joi.string().max(100).optional(),
});

export { createAddressValidation, updateAddressValidation }; 