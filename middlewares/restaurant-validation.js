const Joi = require("joi");
const ErrorHandler = require("../utils/errorHandler");
const asyncHandler = require("express-async-handler");

const getAllRestaurantsSchema = Joi.object({
  page: Joi.number().integer().min(1),

  limit: Joi.number().integer().min(1).max(100),

  search: Joi.string().trim().max(100),

  sort: Joi.string().valid(
    "createdAt",
    "-createdAt",
    "name",
    "-name",
    "status",
    "-status",
  ),

  status: Joi.string().valid("PENDING", "ACTIVE", "INACTIVE", "REJECTED"),
});

const getAllRestaurantAdminSchema = Joi.object({
  page: Joi.number().integer().min(1),

  limit: Joi.number().integer().min(1).max(100),

  search: Joi.string().trim().min(1).max(100),

  sort: Joi.string().valid(
    "createdAt",
    "-createdAt",
    "name",
    "-name",
    "status",
    "-status",
  ),

  status: Joi.string().valid("PENDING", "ACTIVE", "INACTIVE", "REJECTED"),
});

const createRestaurantSchema = Joi.object({
  name: Joi.string().trim().min(2).max(50).required(),
  description: Joi.string().trim().min(2).max(500).required(),
  cuisines: Joi.array().items(Joi.string().uuid()).min(1).required(),
});

const updateRestaurantSchema = Joi.object({
  name: Joi.string().trim().min(2).max(50),
  description: Joi.string().trim().min(2).max(500),
}).min(1);

const updateRestaurantStatusSchema = Joi.object({
  status: Joi.string()
    .valid("PENDING", "ACTIVE", "INACTIVE", "REJECTED")
    .required(),
});

const deleteRestaurantSchema = Joi.object({
  id: Joi.string().uuid().required(),
});

const getAllRestaurantsValidation = asyncHandler(async (req, res, next) => {
  const { error } = getAllRestaurantsSchema.validate(req.query);
  if (error) {
    return next(new ErrorHandler(error.details[0].message, 400));
  }
  next();
});

const getAllRestaurantAdminValidation = asyncHandler(async (req, res, next) => {
  const { error } = getAllRestaurantAdminSchema.validate(req.query);
  if (error) {
    return next(new ErrorHandler(error.details[0].message, 400));
  }
  next();
});

const createRestaurantValidation = asyncHandler(async (req, res, next) => {
  const { error } = createRestaurantSchema.validate(req.body);
  if (error) {
    return next(new ErrorHandler(error.details[0].message, 400));
  }
  next();
});

const updateRestaurantValidation = asyncHandler(async (req, res, next) => {
  const { error } = updateRestaurantSchema.validate(req.body);
  if (error) {
    return next(new ErrorHandler(error.details[0].message, 400));
  }
  next();
});

const updateRestaurantStatusValidation = asyncHandler(
  async (req, res, next) => {
    const { error } = updateRestaurantStatusSchema.validate(req.body);
    if (error) {
      return next(new ErrorHandler(error.details[0].message, 400));
    }
    next();
  },
);

const deleteRestaurantValidation = asyncHandler(async (req, res, next) => {
  const { error } = deleteRestaurantSchema.validate(req.params);
  if (error) {
    return next(new ErrorHandler(error.details[0].message, 400));
  }
  next();
});

module.exports = {
  createRestaurantValidation,
  updateRestaurantValidation,
  updateRestaurantStatusValidation,
  deleteRestaurantValidation,
  getAllRestaurantsValidation,
  getAllRestaurantAdminValidation,
};
