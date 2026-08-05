const Joi = require("joi");
const asyncHandler = require("express-async-handler");
const ErrorHandler = require("../utils/ErrorHandler");

const createCuisineSchema = Joi.object({
  name: Joi.string().trim().min(2).max(50).required(),
});

const updateCuisineSchema = Joi.object({
  name: Joi.string().trim().min(2).max(50),
}).min(1);

const createCuisineValidation = asyncHandler(async (req, res, next) => {
  const { error } = createCuisineSchema.validate(req.body);

  if (error) {
    return next(new ErrorHandler(error.details[0].message, 400));
  }

  next();
});

const updateCuisineValidation = asyncHandler(async (req, res, next) => {
  const { error } = updateCuisineSchema.validate(req.body);

  if (error) {
    return next(new ErrorHandler(error.details[0].message, 400));
  }

  next();
}); 

module.exports = {
  createCuisineValidation,
  updateCuisineValidation,
};
