const asyncHandler = require("express-async-handler");
const ErrorHandler = require("../../utils/ErrorHandler");
const prisma = require("../../utils/prisma");
const apiFeatures = require("../../utils/ApiFeatures");

const getAllUsers = asyncHandler(async (req, res) => {
  const features = new apiFeatures(req.query)
    .paginate()
    .search(["fullName", "email", "phone"])
    .filter({
      fields: ["role", "isEmailVerified"],
      booleans: ["isEmailVerified"],
    })
    .sort(["createdAt", "fullName", "email", "phone"]);
  const where = {
    ...features.where,
    deletedAt: null,
  };
  const users = await prisma.user.findMany({
    where,
    orderBy: features.orderBy,
    skip: features.skip,
    take: features.take,
    select: {
      id: true,
      fullName: true,
      email: true,
      phone: true,
      role: true,
      isEmailVerified: true,
      createdAt: true,
    },
  });
  const total = await prisma.user.count({
    where,
  });

  res.status(200).json({
    users,
    pagination: {
      page: Math.floor(features.skip / features.take) + 1,
      limit: features.take,
      total,
      totalPages: Math.ceil(total / features.take),
    },
  });
});

const getMyProfile = asyncHandler(async (req, res, next) => {
  const user = await prisma.user.findFirst({
    where: {
      id: req.user.id,
      deletedAt: null,
    },
    select: {
      id: true,
      fullName: true,
      email: true,
      phone: true,
      role: true,
      isEmailVerified: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  res.status(200).json({
    user,
  });
});

const getUserById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const user = await prisma.user.findFirst({
    where: {
      id,
      deletedAt: null,
    },
    select: {
      id: true,
      fullName: true,
      email: true,
      phone: true,
      role: true,
      isEmailVerified: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }
  res.status(200).json({
    message: "User retrieved successfully",
    user,
  });
});

const updateMyProfile = asyncHandler(async (req, res, next) => {
  const updates = {};

  if (req.body.fullName) {
    updates.fullName = req.body.fullName;
  }

  if (req.body.phone) {
    const existingPhone = await prisma.user.findFirst({
      where: {
        phone: req.body.phone,
        NOT: {
          id: req.user.id,
        },
      },
    });

    if (existingPhone) {
      return next(new ErrorHandler("Phone already exists", 409));
    }

    updates.phone = req.body.phone;
  }

  // بعدين لما تضيف Cloudinary
  // if (req.file) {
  //   updates.avatar = uploadedImage.secure_url;
  // }

  if (Object.keys(updates).length === 0) {
    return next(new ErrorHandler("No data provided", 400));
  }

  const user = await prisma.user.update({
    where: {
      id: req.user.id,
    },
    data: updates,
    select: {
      id: true,
      fullName: true,
      email: true,
      phone: true,
      avatar: true,
      role: true,
      isEmailVerified: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  res.status(200).json({
    message: "User updated successfully",
    user,
  });
});

const deleteMyAccount = asyncHandler(async (req, res, next) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
  });

  if (!user || user.deletedAt) {
    return next(new ErrorHandler("User not found", 404));
  }

  await prisma.$transaction([
    prisma.verificationToken.deleteMany({ where: { userId: req.user.id } }),
    prisma.refreshToken.deleteMany({ where: { userId: req.user.id } }),
    prisma.user.update({
      where: { id: req.user.id },
      data: {
        deletedAt: new Date(),
        email: `deleted_${req.user.id}_${user.email}`,
        phone: `deleted_${req.user.id}_${user.phone}`,
      },
    }),
  ]);

  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
  });

  res.status(200).json({ message: "Account deleted successfully" });
});

const updateUser = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { role, status } = req.body;

  const updates = {};

  if (role !== undefined) {
    updates.role = role;
  }

  if (status !== undefined) {
    updates.status = status;
  }

  if (Object.keys(updates).length === 0) {
    return next(new ErrorHandler("No data provided", 400));
  }

  const existingUser = await prisma.user.findFirst({
    where: {
      id,
      deletedAt: null,
    },
  });

  if (!existingUser) {
    return next(new ErrorHandler("User not found", 404));
  }

  const user = await prisma.user.update({
    where: {
      id,
    },
    data: updates,
    select: {
      id: true,
      fullName: true,
      email: true,
      phone: true,
      avatar: true,
      role: true,
      status: true,
      isEmailVerified: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  res.status(200).json({
    message: "User updated successfully",
    user,
  });
});

module.exports = {
  getAllUsers,
  getMyProfile,
  getUserById,
  updateMyProfile,
  deleteMyAccount,
  updateUser,
};
