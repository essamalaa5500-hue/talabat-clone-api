const Joi = require("joi");
const asyncHandler = require("express-async-handler");
const ErrorHandler = require("../utils/ErrorHandler");

const createProductSchema = Joi.object({
  name: Joi.string().trim().min(2).max(50).required().messages({
    "string.empty": "Name is required",
    "string.min": "Name must be at least 2 characters",
    "string.max": "Name must not exceed 50 characters",
    "any.required": "Name is required",
  }),

  description: Joi.string().trim().min(2).max(100).optional().messages({
    "string.min": "Description must be at least 2 characters",
    "string.max": "Description must not exceed 100 characters",
  }),

  menuCategoryId: Joi.string().uuid().required().messages({
    "string.guid": "Invalid menu category id",
    "string.empty": "Menu category is required",
    "any.required": "Menu category is required",
  }),
});

const updateProductSchema = Joi.object({
  name: Joi.string().trim().min(2).max(50).messages({
    "string.min": "Name must be at least 2 characters",
    "string.max": "Name must not exceed 50 characters",
  }),

  description: Joi.string().trim().min(2).max(100).messages({
    "string.min": "Description must be at least 2 characters",
    "string.max": "Description must not exceed 100 characters",
  }),
})
  .min(1)
  .messages({
    "object.min": "No data provided",
  });

const updateProductStatusSchema = Joi.object({
  status: Joi.string()
    .valid("AVAILABLE", "OUT_OF_STOCK", "UNAVAILABLE")
    .required()
    .messages({
      "any.only": "Status must be AVAILABLE, OUT_OF_STOCK or UNAVAILABLE",
      "any.required": "Status is required",
    }),
});

const createProductValidation = asyncHandler(async (req, res, next) => {
  const { error } = createProductSchema.validate(req.body);

  if (error) {
    return next(new ErrorHandler(error.details[0].message, 400));
  }

  next();
});

const updateProductValidation = asyncHandler(async (req, res, next) => {
  const { error } = updateProductSchema.validate(req.body);

  if (error) {
    return next(new ErrorHandler(error.details[0].message, 400));
  }

  next();
});

const updateProductStatusValidation = asyncHandler(async (req, res, next) => {
  const { error } = updateProductStatusSchema.validate(req.body);

  if (error) {
    return next(new ErrorHandler(error.details[0].message, 400));
  }

  next();
});

module.exports = {
  createProductValidation,
  updateProductValidation,
  updateProductStatusValidation,
};
