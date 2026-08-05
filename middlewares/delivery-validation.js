const Joi = require("joi");
const asyncHandler = require("express-async-handler");
const ErrorHandler = require("../utils/ErrorHandler");

const assignDriverSchema = Joi.object({
  userId: Joi.string().uuid().required().messages({
    "string.guid": "Invalid driver id",
    "any.required": "Driver id is required",
  }),
});

const orderIdSchema = Joi.object({
  orderId: Joi.string().uuid().required().messages({
    "string.guid": "Invalid order id",
    "any.required": "Order id is required",
  }),
});

const assignDriverValidation = asyncHandler(async (req, res, next) => {
  const { error } = assignDriverSchema.validate(req.body);

  if (error) {
    return next(new ErrorHandler(error.details[0].message, 400));
  }

  next();
});

const pickUpOrderValidation = asyncHandler(async (req, res, next) => {
  const { error } = orderIdSchema.validate(req.params);

  if (error) {
    return next(new ErrorHandler(error.details[0].message, 400));
  }

  next();
});

const deliverOrderValidation = asyncHandler(async (req, res, next) => {
  const { error } = orderIdSchema.validate(req.params);

  if (error) {
    return next(new ErrorHandler(error.details[0].message, 400));
  }

  next();
});

const getDeliveryByIdValidation = asyncHandler(async (req, res, next) => {
  const { error } = orderIdSchema.validate(req.params);

  if (error) {
    return next(new ErrorHandler(error.details[0].message, 400));
  }

  next();
});

const cancelDeliveryValidation = asyncHandler(async (req, res, next) => {
  const { error } = orderIdSchema.validate(req.params);

  if (error) {
    return next(new ErrorHandler(error.details[0].message, 400));
  }

  next();
});

module.exports = {
  assignDriverValidation,
  pickUpOrderValidation,
  deliverOrderValidation,
  getDeliveryByIdValidation,
  cancelDeliveryValidation,
};
