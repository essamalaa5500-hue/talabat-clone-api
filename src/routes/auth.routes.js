const express = require("express");
const router = express.Router();

const {
  register,
  login,
  logout,
  logoutAll,
  forgotPassword,
  changePassword,
  refreshToken,
  verifyEmail,
  resendVerificationEmail,
  resetPassword,
} = require("../controllers/auth.controller");

const verifyToken = require("../../middlewares/verifyToken");
const {
  registerValidation,
  loginValidation,
  forgotPasswordValidation,
  resetPasswordValidation,
  changePasswordValidation,
  verifyEmailValidation,
  resendVerificationEmailValidation,
} = require("../../middlewares/auth-validation");

const loginLimiter = require("../../middlewares/rateLimit.middleware");

router.post("/register", registerValidation, register);
router.post("/login", loginLimiter, loginValidation, login);

router.post("/logout", verifyToken, logout);
router.post("/logoutAll", verifyToken, logoutAll);

router.post("/forgotPassword", forgotPasswordValidation, forgotPassword);
router.post("/resetPassword", resetPasswordValidation, resetPassword);

router.post(
  "/changePassword",
  verifyToken,
  changePasswordValidation,
  changePassword,
);

router.post("/refreshToken", refreshToken);

router.post("/verifyEmail", verifyEmailValidation, verifyEmail);

router.post(
  "/resendVerificationEmail",
  resendVerificationEmailValidation,
  resendVerificationEmail,
);

module.exports = router;
