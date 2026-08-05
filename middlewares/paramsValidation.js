const Joi = require("joi");
const asyncHandler = require("express-async-handler");
const ErrorHandler = require("../utils/ErrorHandler");

const paramsValidation = (fields = []) =>
  asyncHandler(async (req, res, next) => {
    const schemaObject = {};

    fields.forEach((field) => {
      schemaObject[field] = Joi.string()
        .uuid()
        .required()
        .messages({
          "string.guid": `${field} is invalid`,
          "any.required": `${field} is required`,
        });
    });

    const schema = Joi.object(schemaObject);

    const { error } = schema.validate(req.params);

    if (error) {
      return next(new ErrorHandler(error.details[0].message, 400));
    }

    next();
  });

module.exports = paramsValidation;
