const asyncHandler = require("express-async-handler");
const ErrorHandler = require("../../utils/ErrorHandler");
const prisma = require("../../utils/prisma");
const apiFeatures = require("../../utils/ApiFeatures");

const createCoupon = asyncHandler(async (req, res, next) => {
  const {
    code,
    type,
    value,
    minimumOrderAmount,
    maximumDiscount,
    usageLimit,
    startsAt,
    expiresAt,
    description,
    name,
  } = req.body;

  const startDate = new Date(startsAt);
  const expireDate = new Date(expiresAt);

  if (Number.isNaN(startDate.getTime()) || Number.isNaN(expireDate.getTime())) {
    return next(new ErrorHandler("Invalid date format", 400));
  }

  if (startDate >= expireDate) {
    return next(
      new ErrorHandler("Expiration date must be after start date", 400),
    );
  }
  const couponType = type || coupon.type;
  const couponValue = value ?? coupon.value;

  if (couponType === "PERCENTAGE" && couponValue > 100) {
    return next(
      new ErrorHandler("Percentage discount cannot exceed 100%", 400),
    );
  }

  const normalizedCode = code.trim().toUpperCase();

  const existingCoupon = await prisma.coupon.findFirst({
    where: {
      code: normalizedCode,
      deletedAt: null,
    },
  });
  if (existingCoupon) {
    return next(new ErrorHandler("Coupon already exists", 409));
  }

  const coupon = await prisma.coupon.create({
    data: {
      code: normalizedCode,
      type,
      value,
      minimumOrderAmount,
      maximumDiscount,
      usageLimit,
      startsAt,
      expiresAt,
      description,
      name,
    },
    select: {
      id: true,
      code: true,
      type: true,
      value: true,
      minimumOrderAmount: true,
      maximumDiscount: true,
      usageLimit: true,
      startsAt: true,
      expiresAt: true,
      description: true,
      name: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  res.status(201).json({
    message: "Coupon created successfully",
    coupon,
  });
});

const getAllCoupons = asyncHandler(async (req, res) => {
  const features = new apiFeatures(req.query)
    .paginate()
    .search(["code", "name"])
    .sort(["createdAt", "code"]);

  const where = {
    ...features.where,
    deletedAt: null,
  };

  const [coupons, total] = await prisma.$transaction([
    prisma.coupon.findMany({
      where,
      orderBy: features.orderBy,
      skip: features.skip,
      take: features.take,
      select: {
        id: true,
        code: true,
        type: true,
        value: true,
        minimumOrderAmount: true,
        maximumDiscount: true,
        usageLimit: true,
        startsAt: true,
        expiresAt: true,
        description: true,
        name: true,
        createdAt: true,
        isActive: true,
        usedCount: true,
        updatedAt: true,
      },
    }),
    prisma.coupon.count({
      where,
    }),
  ]);

  const now = new Date();

  const formattedCoupons = coupons.map((coupon) => ({
    ...coupon,
    status: !coupon.isActive
      ? "INACTIVE"
      : coupon.expiresAt < now
        ? "EXPIRED"
        : "ACTIVE",
  }));

  res.status(200).json({
    coupons: formattedCoupons,
    pagination: {
      page: features.pagination.page,
      limit: features.pagination.limit,
      total,
      totalPages: Math.ceil(total / features.pagination.limit),
    },
  });
});

const getCouponById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const coupon = await prisma.coupon.findFirst({
    where: {
      id,
      deletedAt: null,
    },
    select: {
      id: true,
      code: true,
      type: true,
      value: true,
      minimumOrderAmount: true,
      maximumDiscount: true,
      usageLimit: true,
      startsAt: true,
      expiresAt: true,
      description: true,
      name: true,
      createdAt: true,
      updatedAt: true,
      isActive: true,
      usedCount: true,
    },
  });
  if (!coupon) {
    return next(new ErrorHandler("Coupon not found", 404));
  }
  const now = new Date();
  res.status(200).json({
    coupon,
    status: !coupon.isActive
      ? "INACTIVE"
      : coupon.expiresAt < now
        ? "EXPIRED"
        : "ACTIVE",
  });
});

const updateCoupon = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const coupon = await prisma.coupon.findFirst({
    where: {
      id,
      deletedAt: null,
    },
  });

  if (!coupon) {
    return next(new ErrorHandler("Coupon not found", 404));
  }
  const {
    code,
    type,
    value,
    minimumOrderAmount,
    maximumDiscount,
    usageLimit,
    startsAt,
    expiresAt,
    description,
    name,
  } = req.body;

  const startDate = startsAt ? new Date(startsAt) : coupon.startsAt;
  const expireDate = expiresAt ? new Date(expiresAt) : coupon.expiresAt;

  if (Number.isNaN(startDate.getTime()) || Number.isNaN(expireDate.getTime())) {
    return next(new ErrorHandler("Invalid date format", 400));
  }

  if (startDate >= expireDate) {
    return next(
      new ErrorHandler("Expiration date must be after start date", 400),
    );
  }
  const couponType = type || coupon.type;
  const couponValue = value ?? coupon.value;

  if (couponType === "PERCENTAGE" && couponValue > 100) {
    return next(
      new ErrorHandler("Percentage discount cannot exceed 100%", 400),
    );
  }

  const normalizedCode = code?.trim().toUpperCase();

  if (code) {
    const existingCode = await prisma.coupon.findFirst({
      where: {
        code: {
          equals: normalizedCode,
          mode: "insensitive",
        },
        deletedAt: null,
        NOT: {
          id,
        },
      },
    });

    if (existingCode) {
      return next(new ErrorHandler("Coupon code already exists", 409));
    }
  }

  const updatedCoupon = await prisma.coupon.update({
    where: {
      id: coupon.id,
    },
    data: {
      code: normalizedCode ?? coupon.code,
      type: couponType,
      value: couponValue,
      minimumOrderAmount: minimumOrderAmount ?? coupon.minimumOrderAmount,
      maximumDiscount: maximumDiscount ?? coupon.maximumDiscount,
      usageLimit: usageLimit ?? coupon.usageLimit,
      startsAt: startDate,
      expiresAt: expireDate,
      description: description ?? coupon.description,
      name: name ?? coupon.name,
    },
    select: {
      id: true,
      code: true,
      type: true,
      value: true,
      minimumOrderAmount: true,
      maximumDiscount: true,
      usageLimit: true,
      startsAt: true,
      expiresAt: true,
      description: true,
      name: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  res.status(200).json({
    message: "Coupon updated successfully",
    coupon: updatedCoupon,
  });
});

const deleteCoupon = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const coupon = await prisma.coupon.findFirst({
    where: {
      id,
      deletedAt: null,
    },
  });

  if (!coupon) {
    return next(new ErrorHandler("Coupon not found", 404));
  }

  await prisma.coupon.update({
    where: {
      id,
    },
    data: {
      deletedAt: new Date(),
      isActive: false,
    },
  });

  res.status(200).json({
    message: "Coupon deleted successfully",
  });
});

module.exports = {
  getAllCoupons,
  getCouponById,
  createCoupon,
  updateCoupon,
  deleteCoupon,
};
