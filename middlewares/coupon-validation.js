const Joi = require("joi");
const asyncHandler = require("express-async-handler");
const ErrorHandler = require("../utils/ErrorHandler");

const createCouponSchema = Joi.object({
  code: Joi.string().trim().uppercase().min(2).max(50).required(),

  type: Joi.string()
    .valid("PERCENTAGE", "FIXED_AMOUNT", "FREE_DELIVERY")
    .required(),

  value: Joi.number().positive().required(),

  minimumOrderAmount: Joi.number().min(0).required(),

  maximumDiscount: Joi.when("type", {
    is: "PERCENTAGE",
    then: Joi.number().positive().required(),
    otherwise: Joi.number().optional(),
  }),

  usageLimit: Joi.number().integer().min(1).required(),

  startsAt: Joi.date().required(),

  expiresAt: Joi.date().greater(Joi.ref("startsAt")).required(),

  description: Joi.string().allow("").optional(),

  name: Joi.string().trim().max(100).optional(),
});

const updateCouponSchema = Joi.object({
  code: Joi.string().trim().uppercase().min(2).max(50),

  type: Joi.string().valid("PERCENTAGE", "FIXED", "FREE_DELIVERY"),

  value: Joi.number().positive(),

  minimumOrderAmount: Joi.number().min(0),

  maximumDiscount: Joi.number().positive(),

  usageLimit: Joi.number().integer().min(1),

  startsAt: Joi.date(),

  expiresAt: Joi.date(),

  description: Joi.string().allow(""),

  name: Joi.string().trim().max(100),
}).min(1);

const couponIdSchema = Joi.object({
  id: Joi.string().uuid().required().messages({
    "string.guid": "Invalid coupon id",
    "any.required": "Coupon id is required",
  }),
});

const createCouponValidation = asyncHandler(async (req, res, next) => {
  const { error } = createCouponSchema.validate(req.body);

  if (error) {
    return next(new ErrorHandler(error.details[0].message, 400));
  }

  next();
});

const updateCouponValidation = asyncHandler(async (req, res, next) => {
  const { error } = updateCouponSchema.validate(req.body);

  if (error) {
    return next(new ErrorHandler(error.details[0].message, 400));
  }

  next();
});

const couponIdValidation = asyncHandler(async (req, res, next) => {
  const { error } = couponIdSchema.validate(req.params);

  if (error) {
    return next(new ErrorHandler(error.details[0].message, 400));
  }

  next();
});

module.exports = {
  createCouponValidation,
  updateCouponValidation,
  couponIdValidation,
};
