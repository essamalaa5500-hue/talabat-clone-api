const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const ErrorHandler = require("../../utils/ErrorHandler");
const sendEmail = require("../../services/sendOtp");
const prisma = require("../../utils/prisma");
const notificationQueue = require("../../queues/notification.queue");
const { loginLimiter } = require("../../utils/rateLimiter");

const register = asyncHandler(async (req, res, next) => {
  const { fullName, email, password, phone } = req.body;
  const existingUser = await prisma.user.findFirst({
    where: {
      email,
      deletedAt: null,
    },
  });
  if (existingUser) {
    return next(new ErrorHandler("Email already exists", 409));
  }

  const existingPhone = await prisma.user.findFirst({
    where: {
      phone,
      deletedAt: null,
    },
  });

  if (existingPhone) {
    return next(new ErrorHandler("Phone already exists", 409));
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      fullName,
      phone,
    },
    select: {
      id: true,
      fullName: true,
      phone: true,
      email: true,
      role: true,
      createdAt: true,
    },
  });
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const hashedOtp = await bcrypt.hash(otp, 10);

  await prisma.verificationToken.upsert({
    where: {
      userId_type: {
        userId: user.id,
        type: "EMAIL_VERIFICATION",
      },
    },
    update: {
      otpHash: hashedOtp,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
      lastSentAt: new Date(),
    },
    create: {
      userId: user.id,
      type: "EMAIL_VERIFICATION",
      otpHash: hashedOtp,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
      lastSentAt: new Date(),
    },
  });
  await sendEmail({
    to: user.email,
    subject: "Verify your email",
    html: `
    <h2>Welcome</h2>
    <p>Your verification code is:</p>
    <h1>${otp}</h1>
    <p>This code expires in 10 minutes.</p>
  `,
  });

  await notificationQueue.add({
    data: {
      userId: user.id,
      type: "EMAIL_VERIFICATION",
      title: "Email Verification",
      body: "Your email has been verified.",
    },
  });
  res.status(201).json({
    message: "User created successfully. Please verify your email.",
    user,
  });
});

const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await prisma.user.findFirst({
    where: {
      email,
      deletedAt: null,
    },
    select: {
      id: true,
      fullName: true,
      phone: true,
      email: true,
      password: true,
      role: true,
      isEmailVerified: true,
      createdAt: true,
    },
  });
  if (!user) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }

  const isPasswordCorrect = await bcrypt.compare(password, user.password);
  if (!isPasswordCorrect) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }

  if (!user.isEmailVerified) {
    return next(new ErrorHandler("Email not verified", 403));
  }
  const accessToken = jwt.sign(
    {
      userId: user.id,
      role: user.role,
    },
    process.env.JWT_SECRET_ACCESS_TOKEN,
    {
      expiresIn: "1d",
    },
  );
  const refreshToken = jwt.sign(
    { userId: user.id },
    process.env.JWT_SECRET_REFRESH_TOKEN,
    {
      expiresIn: "7d",
    },
  );
  await prisma.refreshToken.create({
    data: {
      token: refreshToken,
      userId: user.id,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
    },
  });
  const { password: _, ...safeUser } = user;
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 1000 * 60 * 60 * 24 * 7,
  });
  res.status(200).json({
    message: "User logged in successfully",
    accessToken,
    user: safeUser,
  });
});

const logout = asyncHandler(async (req, res, next) => {
  const { refreshToken } = req.cookies;
  if (!refreshToken) {
    return next(new ErrorHandler("Refresh token not found", 401));
  }
  const refreshTokenData = await prisma.refreshToken.findUnique({
    where: {
      token: refreshToken,
    },
  });
  if (!refreshTokenData) {
    return next(new ErrorHandler("Refresh token not found", 401));
  }
  await prisma.refreshToken.delete({
    where: {
      token: refreshToken,
    },
  });
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
  });
  res.status(200).json({
    message: "User logged out successfully",
  });
});

const logoutAll = asyncHandler(async (req, res) => {
  await prisma.refreshToken.deleteMany({
    where: {
      userId: req.user.id,
    },
  });
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
  });
  res.status(200).json({
    message: "User logged out from all devices successfully",
  });
});

const forgotPassword = asyncHandler(async (req, res, next) => {
  const { email } = req.body;
  const user = await prisma.user.findFirst({
    where: {
      email,
      deletedAt: null,
    },
    select: {
      id: true,
      fullName: true,
      phone: true,
      email: true,
      password: true,
      role: true,
      isEmailVerified: true,
      createdAt: true,
    },
  });
  if (!user) {
    return next(
      new ErrorHandler("If this email exists, an OTP has been sent.", 404),
    );
  }
  if (!user.isEmailVerified) {
    return next(new ErrorHandler("Email not verified", 403));
  }
  const verificationToken = await prisma.verificationToken.findUnique({
    where: {
      userId_type: {
        userId: user.id,
        type: "FORGOT_PASSWORD",
      },
    },
  });

  if (
    verificationToken &&
    Date.now() - verificationToken.lastSentAt.getTime() < 60 * 1000
  ) {
    return next(
      new ErrorHandler(
        "Please wait 60 seconds before requesting another OTP",
        429,
      ),
    );
  }
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const hashedOtp = await bcrypt.hash(otp, 10);
  await prisma.verificationToken.upsert({
    where: {
      userId_type: {
        userId: user.id,
        type: "FORGOT_PASSWORD",
      },
    },
    update: {
      otpHash: hashedOtp,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
      lastSentAt: new Date(),
    },
    create: {
      userId: user.id,
      type: "FORGOT_PASSWORD",
      otpHash: hashedOtp,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
      lastSentAt: new Date(),
    },
  });
  await sendEmail({
    to: user.email,
    subject: "Reset Password OTP",
    html: `
      <h2>Password Reset</h2>
      <p>Your OTP is:</p>
      <h1>${otp}</h1>
      <p>This code expires in 10 minutes.</p>
  `,
  });
  res.status(200).json({
    message: "If this email exists, an OTP has been sent.",
  });
});

const resetPassword = asyncHandler(async (req, res, next) => {
  const { email, newPassword, otp } = req.body;
  const user = await prisma.user.findFirst({
    where: {
      email,
      deletedAt: null,
    },
    select: {
      id: true,
      fullName: true,
      phone: true,
      email: true,
      password: true,
      role: true,
      isEmailVerified: true,
      createdAt: true,
    },
  });
  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }
  const verificationToken = await prisma.verificationToken.findUnique({
    where: {
      userId_type: {
        userId: user.id,
        type: "FORGOT_PASSWORD",
      },
    },
  });
  if (!verificationToken) {
    return next(new ErrorHandler("OTP not found", 404));
  }
  if (verificationToken.expiresAt < new Date()) {
    return next(new ErrorHandler("Invalid OTP", 401));
  }
  const isOtpCorrect = await bcrypt.compare(otp, verificationToken.otpHash);
  if (!isOtpCorrect) {
    return next(new ErrorHandler("Invalid OTP", 401));
  }
  const isSamePassword = await bcrypt.compare(newPassword, user.password);

  if (isSamePassword) {
    return next(
      new ErrorHandler(
        "New password must be different from the old password",
        400,
      ),
    );
  }
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  await prisma.$transaction([
    prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        password: hashedPassword,
      },
    }),
  ]);
  await prisma.verificationToken.delete({
    where: {
      userId_type: {
        userId: user.id,
        type: "FORGOT_PASSWORD",
      },
    },
  });
  await prisma.refreshToken.deleteMany({
    where: {
      userId: user.id,
    },
  });
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
  });
  await notificationQueue.add({
    userId: user.id,
    type: "PASSWORD_RESET",
    title: "Password Reset",
    body: "Your password has been reset successfully.",
  });
  res.status(200).json({
    message: "Password reset successfully",
  });
});

const changePassword = asyncHandler(async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;
  const user = await prisma.user.findFirst({
    where: {
      id: req.user.id,
      deletedAt: null,
    },
    select: {
      id: true,
      fullName: true,
      phone: true,
      email: true,
      password: true,
      role: true,
      isEmailVerified: true,
      createdAt: true,
    },
  });
  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }
  const isPasswordCorrect = await bcrypt.compare(
    currentPassword,
    user.password,
  );
  if (!isPasswordCorrect) {
    return next(new ErrorHandler("Invalid password", 401));
  }
  const isSamePassword = await bcrypt.compare(newPassword, user.password);
  if (isSamePassword) {
    return next(
      new ErrorHandler(
        "New password must be different from the old password",
        400,
      ),
    );
  }
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  await prisma.$transaction([
    prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        password: hashedPassword,
      },
    }),
  ]);
  await prisma.refreshToken.deleteMany({
    where: {
      userId: user.id,
    },
  });
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
  });
  res.status(200).json({
    message: "Password changed successfully",
  });
});

const refreshToken = asyncHandler(async (req, res, next) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken) {
    return next(new ErrorHandler(401, "Refresh token not found"));
  }

  try {
    jwt.verify(refreshToken, process.env.JWT_SECRET_REFRESH_TOKEN);
  } catch {
    return next(new ErrorHandler("Invalid refresh token", 401));
  }

  const refreshTokenData = await prisma.refreshToken.findUnique({
    where: {
      token: refreshToken,
    },
  });
  if (!refreshTokenData) {
    return next(new ErrorHandler("Refresh token not found", 401));
  }
  if (refreshTokenData.expiresAt < new Date()) {
    return next(new ErrorHandler("Refresh token expired", 401));
  }
  const user = await prisma.user.findUnique({
    where: {
      id: refreshTokenData.userId,
    },
    select: {
      id: true,
    },
  });
  if (!user) {
    return next(new ErrorHandler("Refresh token not found", 401));
  }

  const accessToken = jwt.sign(
    { userId: user.id },
    process.env.JWT_SECRET_ACCESS_TOKEN,
    {
      expiresIn: "15m",
    },
  );

  await prisma.refreshToken.delete({
    where: {
      token: refreshToken,
    },
  });

  const newRefreshToken = jwt.sign(
    { userId: user.id },
    process.env.JWT_SECRET_REFRESH_TOKEN,
    {
      expiresIn: "7d",
    },
  );

  await prisma.refreshToken.create({
    data: {
      token: newRefreshToken,
      userId: user.id,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
    },
  });

  res.cookie("refreshToken", newRefreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 1000 * 60 * 60 * 24 * 7,
  });

  res.status(200).json({
    accessToken,
  });
});

const verifyEmail = asyncHandler(async (req, res, next) => {
  const { email, otp } = req.body;

  const user = await prisma.user.findFirst({
    where: {
      email,
      deletedAt: null,
    },
    select: {
      id: true,
      isEmailVerified: true,
    },
  });

  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  if (user.isEmailVerified) {
    return next(new ErrorHandler("Email already verified", 400));
  }

  const verificationToken = await prisma.verificationToken.findUnique({
    where: {
      userId_type: {
        userId: user.id,
        type: "EMAIL_VERIFICATION",
      },
    },
  });

  if (!verificationToken) {
    return next(new ErrorHandler("OTP not found", 404));
  }

  if (verificationToken.expiresAt < new Date()) {
    return next(new ErrorHandler("OTP expired", 400));
  }

  const isOtpCorrect = await bcrypt.compare(otp, verificationToken.otpHash);
  if (!isOtpCorrect) {
    return next(new ErrorHandler("Invalid OTP", 400));
  }

  await prisma.$transaction([
    prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        isEmailVerified: true,
      },
    }),
  ]);

  await prisma.verificationToken.delete({
    where: {
      userId_type: {
        userId: user.id,
        type: "EMAIL_VERIFICATION",
      },
    },
  });

  res.status(200).json({
    message: "Email verified successfully",
  });
});

const resendVerificationEmail = asyncHandler(async (req, res, next) => {
  const { email } = req.body;

  const user = await prisma.user.findFirst({
    where: {
      email,
      deletedAt: null,
    },
    select: {
      id: true,
      email: true,
      isEmailVerified: true,
    },
  });

  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  if (user.isEmailVerified) {
    return next(new ErrorHandler("Email already verified", 400));
  }
  const verificationToken = await prisma.verificationToken.findUnique({
    where: {
      userId_type: {
        userId: user.id,
        type: "EMAIL_VERIFICATION",
      },
    },
  });
  if (
    verificationToken &&
    Date.now() - verificationToken.lastSentAt.getTime() < 60 * 1000
  ) {
    return next(
      new ErrorHandler(
        "Please wait 60 seconds before requesting another OTP",
        429,
      ),
    );
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const hashedOtp = await bcrypt.hash(otp, 10);

  await prisma.verificationToken.upsert({
    where: {
      userId_type: {
        userId: user.id,
        type: "EMAIL_VERIFICATION",
      },
    },
    update: {
      otpHash: hashedOtp,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
      lastSentAt: new Date(),
    },
    create: {
      userId: user.id,
      type: "EMAIL_VERIFICATION",
      otpHash: hashedOtp,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
      lastSentAt: new Date(),
    },
  });

  await sendEmail({
    to: user.email,
    subject: "Verify Email OTP",
    html: `
      <h2>Verify Email</h2>
      <p>Your OTP is:</p>
      <h1>${otp}</h1>
      <p>This code expires in 10 minutes.</p>
  `,
  });

  res.status(200).json({
    message: "Verification email sent successfully.",
  });
});

module.exports = {
  register,
  login,
  logout,
  logoutAll,
  forgotPassword,
  changePassword,
  resetPassword,
  refreshToken,
  verifyEmail,
  resendVerificationEmail,
};
