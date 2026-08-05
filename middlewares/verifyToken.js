const jwt = require("jsonwebtoken");
const prisma = require("../utils/prisma");
const asyncHandler = require("express-async-handler");
const ErrorHandler = require("../utils/ErrorHandler");

const verifyToken = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return next(new ErrorHandler("No token provided", 401));
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return next(new ErrorHandler("Invalid token", 401));
  }

  let decoded;

  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET_ACCESS_TOKEN);
  } catch (error) {
    return next(new ErrorHandler("Invalid or expired token", 401));
  }

  const user = await prisma.user.findFirst({
    where: {
      id: decoded.userId,
      deletedAt: null,
    },
  });

  if (!user) {
    return next(new ErrorHandler("User no longer exists", 401));
  }

  req.user = user;

  next();
});

module.exports = verifyToken;
