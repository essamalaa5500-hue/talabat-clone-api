const Joi = require("joi");
const asyncHandler = require("express-async-handler");
const ErrorHandler = require("../utils/ErrorHandler");

const createProductVariantSchema = Joi.object({
  name: Joi.string().trim().min(2).max(50).required().messages({
    "string.empty": "Name is required",
    "string.min": "Name must be at least 2 characters",
    "string.max": "Name must not exceed 50 characters",
    "any.required": "Name is required",
  }),

  price: Joi.number().min(1).required().messages({
    "number.min": "Price must be greater than 0",
    "any.required": "Price is required",
  }),

  discountPrice: Joi.number().positive().precision(2).optional(),
});

const updateProductVariantSchema = Joi.object({
  name: Joi.string().trim().min(2).max(50),

  price: Joi.number().positive().precision(2),

  discountPrice: Joi.number().positive().precision(2),
}).min(1);

const updateProductVariantStatusSchema = Joi.object({
  status: Joi.string()
    .valid("AVAILABLE", "OUT_OF_STOCK", "UNAVAILABLE")
    .required()
    .messages({
      "any.only": "Status must be AVAILABLE, OUT_OF_STOCK or UNAVAILABLE",
      "any.required": "Status is required",
    }),
});

const createProductVariantValidation = asyncHandler(async (req, res, next) => {
  const { error } = createProductVariantSchema.validate(req.body);

  if (error) {
    return next(new ErrorHandler(error.details[0].message, 400));
  }

  next();
});

const updateProductVariantValidation = asyncHandler(async (req, res, next) => {
  const { error } = updateProductVariantSchema.validate(req.body);

  if (error) {
    return next(new ErrorHandler(error.details[0].message, 400));
  }

  next();
});

const updateProductVariantStatusValidation = asyncHandler(
  async (req, res, next) => {
    const { error } = updateProductVariantStatusSchema.validate(req.body);

    if (error) {
      return next(new ErrorHandler(error.details[0].message, 400));
    }

    next();
  },
);

module.exports = {
  createProductVariantValidation,
  updateProductVariantValidation,
  updateProductVariantStatusValidation,
};
