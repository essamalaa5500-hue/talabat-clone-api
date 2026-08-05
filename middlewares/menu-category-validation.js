const Joi = require("joi");
const asyncHandler = require("express-async-handler");
const ErrorHandler = require("../utils/ErrorHandler");

const createMenuCategorySchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).required().messages({
    "string.empty": "Name is required",
    "string.min": "Name must be at least 2 characters",
    "string.max": "Name must not exceed 100 characters",
    "any.required": "Name is required",
  }),
});

const updateMenuCategorySchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).optional(),
})
  .min(1)
  .messages({
    "object.min": "At least one field is required",
  });

const createMenuCategoryValidation = asyncHandler(async (req, res, next) => {
  const { error } = createMenuCategorySchema.validate(req.body);

  if (error) {
    return next(new ErrorHandler(error.details[0].message, 400));
  }

  next();
});

const updateMenuCategoryValidation = asyncHandler(async (req, res, next) => {
  const { error } = updateMenuCategorySchema.validate(req.body);

  if (error) {
    return next(new ErrorHandler(error.details[0].message, 400));
  }

  next();
});

module.exports = {
  createMenuCategoryValidation,
  updateMenuCategoryValidation,
};
