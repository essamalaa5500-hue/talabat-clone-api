const Joi = require("joi");
const asyncHandler = require("express-async-handler");
const ErrorHandler = require("../utils/ErrorHandler");

const createDriverReviewSchema = Joi.object({
  rating: Joi.number().integer().min(1).max(5).required(),

  comment: Joi.string().trim().max(500).allow("", null),
});

const updateDriverReviewSchema = Joi.object({
  rating: Joi.number().integer().min(1).max(5),

  comment: Joi.string().trim().max(500).allow("", null),
}).min(1);

const createDriverReviewValidation = asyncHandler(async (req, res, next) => {
  const { rating, comment } = req.body;

  const schema = createDriverReviewSchema.required();

  const { error } = schema.validate({ rating, comment });

  if (error) {
    return next(new ErrorHandler("Invalid review data", 400));
  }

  req.body.rating = rating;
  req.body.comment = comment;

  next();
});

const updateDriverReviewValidation = asyncHandler(async (req, res, next) => {
  const { rating, comment } = req.body;

  const schema = updateDriverReviewSchema.required();

  const { error } = schema.validate({ rating, comment });

  if (error) {
    return next(new ErrorHandler("Invalid review data", 400));
  }

  req.body.rating = rating;
  req.body.comment = comment;

  next();
});

module.exports = {
  createDriverReviewValidation,
  updateDriverReviewValidation,
};
