const Joi = require("joi");
const asyncHandler = require("express-async-handler");
const ErrorHandler = require("../utils/ErrorHandler");

const addToCartSchema = Joi.object({
  branchId: Joi.string().uuid().required().messages({
    "string.guid": "Invalid branch id",
    "any.required": "Branch id is required",
  }),

  productVariantId: Joi.string().uuid().required().messages({
    "string.guid": "Invalid product variant id",
    "any.required": "Product variant id is required",
  }),

  quantity: Joi.number().integer().min(1).required().messages({
    "number.base": "Quantity must be a number",
    "number.integer": "Quantity must be an integer",
    "number.min": "Quantity must be at least 1",
    "any.required": "Quantity is required",
  }),

  optionValueIds: Joi.array()
    .items(
      Joi.string().uuid().messages({
        "string.guid": "Invalid option value id",
      }),
    )
    .optional(),
});

const updateQuantitySchema = Joi.object({
  quantity: Joi.number().integer().min(1).required().messages({
    "number.base": "Quantity must be a number",
    "number.integer": "Quantity must be an integer",
    "number.min": "Quantity must be at least 1",
    "any.required": "Quantity is required",
  }),
});

const addToCartValidation = asyncHandler(async (req, res, next) => {
  const { error } = addToCartSchema.validate(req.body);

  if (error) {
    return next(new ErrorHandler(error.details[0].message, 400));
  }

  next();
});

const updateQuantityValidation = asyncHandler(async (req, res, next) => {
  const { error } = updateQuantitySchema.validate(req.body);

  if (error) {
    return next(new ErrorHandler(error.details[0].message, 400));
  }

  next();
});

module.exports = {
  addToCartValidation,
  updateQuantityValidation,
};
