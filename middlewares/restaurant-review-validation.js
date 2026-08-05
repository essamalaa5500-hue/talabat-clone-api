const Joi = require("joi");
const asyncHandler = require("express-async-handler");
const ErrorHandler = require("../utils/ErrorHandler");

const createRestaurantReviewSchema = Joi.object({
  rating: Joi.number().integer().min(1).max(5).required(),

  comment: Joi.string().trim().max(500).allow("", null),
});

const updateRestaurantReviewSchema = Joi.object({
  rating: Joi.number().integer().min(1).max(5),

  comment: Joi.string().trim().max(500).allow("", null),
}).min(1);

const createRestaurantReviewValidation = asyncHandler(
  async (req, res, next) => {
    const { rating, comment } = req.body;

    const schema = createRestaurantReviewSchema.required();

    const { error } = schema.validate({ rating, comment });

    if (error) {
      return next(new ErrorHandler("Invalid review data", 400));
    }

    req.body.rating = rating;
    req.body.comment = comment;

    next();
  },
);

const updateRestaurantReviewValidation = asyncHandler(
  async (req, res, next) => {
    const { rating, comment } = req.body;

    const schema = updateRestaurantReviewSchema.required();

    const { error } = schema.validate({ rating, comment });

    if (error) {
      return next(new ErrorHandler("Invalid review data", 400));
    }

    req.body.rating = rating;
    req.body.comment = comment;

    next();
  },
);

module.exports = {
  createRestaurantReviewValidation,
  updateRestaurantReviewValidation,
};
