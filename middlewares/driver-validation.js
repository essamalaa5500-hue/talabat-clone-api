const Joi = require("joi");
const ErrorHandler = require("../utils/ErrorHandler");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");

const updateDriverSchema = Joi.object({
  fullName: Joi.string().trim().min(3).max(100),

  phone: Joi.string().trim().min(10).max(15),

  avatar: Joi.string().uri(),

  nationalId: Joi.string().trim(),

  licenseNumber: Joi.string().trim(),

  vehicleType: Joi.string().valid("BIKE", "CAR", "VAN"),

  vehiclePlateNumber: Joi.string().trim(),

  status: Joi.string().valid("AVAILABLE", "BUSY", "OFFLINE"),
}).min(1);

const changeDriverStatusSchema = Joi.object({
  status: Joi.string().valid("ONLINE", "OFFLINE").required(),
});

const updateMyProfileSchema = Joi.object({
  fullName: Joi.string().trim().min(3).max(100),

  phone: Joi.string().trim().min(10).max(15),

  avatar: Joi.string().uri(),
}).min(1);

const updateDriverValidation = asyncHandler(async (req, res, next) => {
  const { error } = updateDriverSchema.validate(req.body);

  if (error) {
    return next(new ErrorHandler("Invalid data", 400));
  }

  next();
});

const changeDriverStatusValidation = asyncHandler(async (req, res, next) => {
  const { error } = changeDriverStatusSchema.validate(req.body);

  if (error) {
    return next(new ErrorHandler("Invalid data", 400));
  }

  next();
});

const updateMyProfileValidation = asyncHandler(async (req, res, next) => {
  const { error } = updateMyProfileSchema.validate(req.body);

  if (error) {
    return next(new ErrorHandler("Invalid data", 400));
  }

  next();
});

module.exports = {
  updateDriverValidation,
  changeDriverStatusValidation,
  updateMyProfileValidation,
};
