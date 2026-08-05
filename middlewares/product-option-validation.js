const Joi = require("joi");
const asyncHandler = require("express-async-handler");
const ErrorHandler = require("../utils/ErrorHandler");

const createProductOptionSchema = Joi.object({
  name: Joi.string().trim().min(2).max(50).required().messages({
    "string.empty": "Option name is required",
    "string.min": "Option name must be at least 2 characters",
    "string.max": "Option name must not exceed 50 characters",
    "any.required": "Option name is required",
  }),

  isRequired: Joi.boolean().optional(),

  maxSelections: Joi.number().integer().min(1).optional().messages({
    "number.base": "Max selections must be a number",
    "number.integer": "Max selections must be an integer",
    "number.min": "Max selections must be at least 1",
  }),
});

const updateProductOptionSchema = Joi.object({
  name: Joi.string().trim().min(2).max(50).messages({
    "string.min": "Option name must be at least 2 characters",
    "string.max": "Option name must not exceed 50 characters",
  }),

  isRequired: Joi.boolean(),

  maxSelections: Joi.number().integer().min(1).messages({
    "number.base": "Max selections must be a number",
    "number.integer": "Max selections must be an integer",
    "number.min": "Max selections must be at least 1",
  }),
}).min(1);

const createProductOptionValidation = asyncHandler(async (req, res, next) => {
  const { error } = createProductOptionSchema.validate(req.body);

  if (error) {
    return next(new ErrorHandler(error.details[0].message, 400));
  }

  next();
});

const updateProductOptionValidation = asyncHandler(async (req, res, next) => {
  const { error } = updateProductOptionSchema.validate(req.body);

  if (error) {
    return next(new ErrorHandler(error.details[0].message, 400));
  }

  next();
});

module.exports = {
  createProductOptionValidation,
  updateProductOptionValidation,
};
