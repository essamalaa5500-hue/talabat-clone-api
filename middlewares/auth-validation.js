const Joi = require("joi");
const asyncHandler = require("express-async-handler");
const ErrorHandler = require("../utils/ErrorHandler");

const registerSchema = Joi.object({
  fullName: Joi.string().trim().min(2).max(50).required(),
  email: Joi.string().trim().lowercase().email().required(),
  password: Joi.string().min(8).max(100).required(),
  phone: Joi.string()
    .pattern(/^[0-9]{10,15}$/)
    .required(),
});

const loginSchema = Joi.object({
  email: Joi.string().trim().lowercase().email().required(),
  password: Joi.string().min(8).max(100).required(),
});

const forgotPasswordSchema = Joi.object({
  email: Joi.string().trim().lowercase().email().required(),
});

const resetPasswordSchema = Joi.object({
  email: Joi.string().trim().lowercase().email().required(),
  otp: Joi.string().length(6).required(),
  newPassword: Joi.string().min(8).max(100).required(),
});

const changePasswordSchema = Joi.object({
  currentPassword: Joi.string().required(),
  newPassword: Joi.string().min(8).max(100).required(),
});

const verifyEmailSchema = Joi.object({
  email: Joi.string().trim().lowercase().email().required(),
  otp: Joi.string().length(6).required(),
});

const resendVerificationEmailSchema = Joi.object({
  email: Joi.string().trim().lowercase().email().required(),
});

const registerValidation = asyncHandler(async (req, res, next) => {
  const { error } = registerSchema.validate(req.body);
  if (error) {
    return next(new ErrorHandler(error.details[0].message, 400));
  }
  next();
});

const loginValidation = asyncHandler(async (req, res, next) => {
  const { error } = loginSchema.validate(req.body);
  if (error) {
    return next(new ErrorHandler(error.details[0].message, 400));
  }
  next();
});

const forgotPasswordValidation = asyncHandler(async (req, res, next) => {
  const { error } = forgotPasswordSchema.validate(req.body);
  if (error) {
    return next(new ErrorHandler(error.details[0].message, 400));
  }
  next();
});

const resetPasswordValidation = asyncHandler(async (req, res, next) => {
  const { error } = resetPasswordSchema.validate(req.body);
  if (error) {
    return next(new ErrorHandler(error.details[0].message, 400));
  }
  next();
});

const changePasswordValidation = asyncHandler(async (req, res, next) => {
  const { error } = changePasswordSchema.validate(req.body);
  if (error) {
    return next(new ErrorHandler(error.details[0].message, 400));
  }
  next();
});

const verifyEmailValidation = asyncHandler(async (req, res, next) => {
  const { error } = verifyEmailSchema.validate(req.body);
  if (error) {
    return next(new ErrorHandler(error.details[0].message, 400));
  }
  next();
});

const resendVerificationEmailValidation = asyncHandler(
  async (req, res, next) => {
    const { error } = resendVerificationEmailSchema.validate(req.body);
    if (error) {
      return next(new ErrorHandler(error.details[0].message, 400));
    }
    next();
  },
);

module.exports = {
  registerValidation,
  loginValidation,
  forgotPasswordValidation,
  resetPasswordValidation,
  changePasswordValidation,
  verifyEmailValidation,
  resendVerificationEmailValidation,
};
