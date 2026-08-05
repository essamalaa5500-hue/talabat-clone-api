const Joi = require("joi");
const ErrorHandler = require("../utils/ErrorHandler");

const getAllUsersSchema = Joi.object({
  page: Joi.number().integer().min(1),
  limit: Joi.number().integer().min(1).max(100),
  search: Joi.string().trim().max(100),
  sort: Joi.string(),
  order: Joi.string().valid("asc", "desc"),
  role: Joi.string().valid("CUSTOMER", "RESTAURANT_OWNER", "DRIVER", "ADMIN"),
  isEmailVerified: Joi.boolean(),
});

const updateProfileSchema = Joi.object({
  fullName: Joi.string().trim().min(2).max(50),

  phone: Joi.string().pattern(/^[0-9]{10,15}$/),

  avatar: Joi.string().uri(),
}).min(1);

const updateUserSchema = Joi.object({
  role: Joi.string().valid("CUSTOMER", "RESTAURANT_OWNER", "DRIVER", "ADMIN"),

  status: Joi.string().valid("ACTIVE", "SUSPENDED", "BANNED"),
}).min(1);

const getAllUsersValidation = (req, res, next) => {
  const { error } = getAllUsersSchema.validate(req.query);
  if (error) {
    return next(new ErrorHandler("Invalid query", 400));
  }
  next();
};

const updateProfileValidation = (req, res, next) => {
  const { error } = updateProfileSchema.validate(req.body);
  if (error) {
    return next(new ErrorHandler("Invalid data", 400));
  }
  next();
};

const updateUserValidation = (req, res, next) => {
  const { error } = updateUserSchema.validate(req.body);
  if (error) {
    return next(new ErrorHandler("Invalid data", 400));
  }
  next();
};

module.exports = {
  getAllUsersValidation,
  updateProfileValidation,
  updateUserValidation,
};
