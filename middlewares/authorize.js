const ErrorHandler = require("../utils/ErrorHandler");
const prisma = require("../utils/prisma");

const authorize = (...roles) => {
  return (req, res, next) => {
    console.log("User:", req.user);
    console.log("Role:", req.user.role);
    console.log("Allowed:", roles);
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorHandler("You are not authorized to access this resource", 403),
      );
    }

    next();
  };
};

module.exports = authorize;
