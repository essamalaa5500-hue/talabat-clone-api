const Joi = require("joi");
const asyncHandler = require("express-async-handler");
const ErrorHandler = require("../utils/ErrorHandler");

const createPaymentSchema = Joi.object({
  paymentMethod: Joi.string()
    .valid("CASH", "CARD", "WALLET")
    .required()
    .messages({
      "any.only": "Payment method must be CASH, CARD or WALLET",
      "any.required": "Payment method is required",
    }),
});

const updatePaymentStatusSchema = Joi.object({
  status: Joi.string().valid("PAID", "FAILED", "REFUNDED").required().messages({
    "any.only": "Status must be PAID, FAILED or REFUNDED",
    "any.required": "Status is required",
  }),
});

const createPaymentValidation = asyncHandler(async (req, res, next) => {
  const { error } = createPaymentSchema.validate(req.body);

  if (error) {
    return next(new ErrorHandler(error.details[0].message, 400));
  }

  next();
});

const updatePaymentStatusValidation = asyncHandler(async (req, res, next) => {
  const { error } = updatePaymentStatusSchema.validate(req.body);

  if (error) {
    return next(new ErrorHandler(error.details[0].message, 400));
  }

  next();
});

module.exports = {
  createPaymentValidation,
  updatePaymentStatusValidation,
};
