const Joi = require("joi");
const asyncHandler = require("express-async-handler");
const ErrorHandler = require("../utils/ErrorHandler");

const createBranchSchema = Joi.object({
  restaurantId: Joi.string().uuid().required(),
  name: Joi.string().trim().min(2).max(100).required(),
  description: Joi.string().trim().max(500).allow("", null),
  phone: Joi.string().trim().min(10).max(20).required(),
  deliveryFee: Joi.number().min(0).required(),
  minimumOrderAmount: Joi.number().min(0).required(),
  averageDeliveryTime: Joi.number().integer().min(1).required(),
});

const updateBranchSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100),
  description: Joi.string().trim().max(500).allow("", null),
  phone: Joi.string().trim().min(10).max(20),
  deliveryFee: Joi.number().min(0),
  minimumOrderAmount: Joi.number().min(0),
  averageDeliveryTime: Joi.number().integer().min(1),
}).min(1);

const updateBranchStatusSchema = Joi.object({
  status: Joi.string().valid("ACTIVE", "INACTIVE", "PENDING").required(),
});

const createBranchValidation = asyncHandler(async (req, res, next) => {
  const { error } = createBranchSchema.validate(req.body);

  if (error) {
    return next(new ErrorHandler(error.details[0].message, 400));
  }

  next();
});

const updateBranchValidation = asyncHandler(async (req, res, next) => {
  const { error } = updateBranchSchema.validate(req.body);

  if (error) {
    return next(new ErrorHandler(error.details[0].message, 400));
  }

  next();
});

const updateBranchStatusValidation = asyncHandler(async (req, res, next) => {
  const { error } = updateBranchStatusSchema.validate(req.body);

  if (error) {
    return next(new ErrorHandler(error.details[0].message, 400));
  }

  next();
});

module.exports = {
  createBranchValidation,
  updateBranchValidation,
  updateBranchStatusValidation,
};
