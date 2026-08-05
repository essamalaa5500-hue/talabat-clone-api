const Joi = require("joi");
const asyncHandler = require("express-async-handler");
const ErrorHandler = require("../utils/ErrorHandler");

const createOptionValueSchema = Joi.object({
  name: Joi.string().trim().min(2).max(50).required().messages({
    "string.empty": "Name is required",
    "string.min": "Name must be at least 2 characters",
    "string.max": "Name must not exceed 50 characters",
    "any.required": "Name is required",
  }),

  extraPrice: Joi.number().min(0).required().messages({
    "number.base": "Extra price must be a number",
    "number.min": "Extra price must be greater than or equal to 0",
    "any.required": "Extra price is required",
  }),
});

const updateOptionValueSchema = Joi.object({
  name: Joi.string().trim().min(2).max(50).messages({
    "string.min": "Name must be at least 2 characters",
    "string.max": "Name must not exceed 50 characters",
  }),

  extraPrice: Joi.number().min(0).messages({
    "number.base": "Extra price must be a number",
    "number.min": "Extra price must be greater than or equal to 0",
  }),
})
  .min(1)
  .messages({
    "object.min": "No data provided",
  });

const createOptionValueValidation = asyncHandler(async (req, res, next) => {
  const { error } = createOptionValueSchema.validate(req.body);

  if (error) {
    return next(new ErrorHandler(error.details[0].message, 400));
  }

  next();
});

const updateOptionValueValidation = asyncHandler(async (req, res, next) => {
  const { error } = updateOptionValueSchema.validate(req.body);

  if (error) {
    return next(new ErrorHandler(error.details[0].message, 400));
  }

  next();
});

module.exports = {
  createOptionValueValidation,
  updateOptionValueValidation,
};
