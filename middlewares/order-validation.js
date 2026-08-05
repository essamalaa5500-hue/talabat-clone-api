const Joi = require("joi");
const asyncHandler = require("express-async-handler");
const ErrorHandler = require("../utils/ErrorHandler");


const createOrderSchema = Joi.object({
  notes: Joi.string().trim().max(500).allow("", null).messages({
    "string.max": "Notes must not exceed 500 characters",
  }),

  address: Joi.string().trim().min(5).max(255).required().messages({
    "string.empty": "Address is required",
    "string.min": "Address must be at least 5 characters",
    "string.max": "Address must not exceed 255 characters",
    "any.required": "Address is required",
  }),
});

const assignDriverSchema = Joi.object({
  driverId: Joi.string().uuid().required().messages({
    "string.guid": "Invalid driver id",
    "any.required": "Driver id is required",
  }),
});

const createOrderValidation = asyncHandler(async (req, res, next) => {
  const { error } = createOrderSchema.validate(req.body);

  if (error) {
    return next(new ErrorHandler(error.details[0].message, 400));
  }

  next();
});

const assignDriverValidation = asyncHandler(async (req, res, next) => {
  const { error } = assignDriverSchema.validate(req.body);

  if (error) {
    return next(new ErrorHandler(error.details[0].message, 400));
  }

  next();
});

module.exports = {
  createOrderValidation,
  assignDriverValidation,
};
