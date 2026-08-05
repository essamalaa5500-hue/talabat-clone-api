const asyncHandler = require("express-async-handler");
const ErrorHandler = require("../../utils/ErrorHandler");
const prisma = require("../../utils/prisma");
const ApiFeatures = require("../../utils/ApiFeatures");
const notificationQueue = require("../../queues/notification.queue");
const { sendNotification } = require("../../services/notification.service");

const createDriverReview = asyncHandler(async (req, res, next) => {
  const { orderId } = req.params;
  const { rating, comment } = req.body;

  const order = await prisma.order.findFirst({
    where: {
      id: orderId,
      userId: req.user.id,
      status: "DELIVERED",
      deletedAt: null,
    },
  });

  if (!order) {
    return next(new ErrorHandler("Delivered order not found", 404));
  }

  const existingReview = await prisma.driverReview.findFirst({
    where: {
      orderId,
      deletedAt: null,
    },
  });

  if (existingReview) {
    return next(new ErrorHandler("You already reviewed this order", 400));
  }

  const review = await prisma.driverReview.create({
    data: {
      userId: req.user.id,
      driverId: order.driverId,
      orderId,
      rating,
      comment,
    },
  });

  await sendNotification({
    room: `user:${req.user.id}`,
    userId: req.user.id,
    type: "DRIVER_REVIEW",
    title: "New Review",
    body: "You have reviewed this order.",
  });

  return res.status(201).json({
    message: "Driver review created successfully",
    review,
  });
});

const updateDriverReview = asyncHandler(async (req, res, next) => {
  const { orderId } = req.params;
  const { rating, comment } = req.body;

  const review = await prisma.driverReview.findUnique({
    where: {
      orderId,
    },
  });

  if (!review) {
    return next(new ErrorHandler("Driver review not found", 404));
  }

  if (review.userId !== req.user.id) {
    return next(new ErrorHandler("You are not the owner of this review", 403));
  }

  const updatedReview = await prisma.driverReview.update({
    where: {
      orderId,
    },
    data: {
      rating,
      comment,
    },
  });

  return res.status(200).json({
    message: "Driver review updated successfully",
    review: updatedReview,
  });
});

const deleteDriverReview = asyncHandler(async (req, res, next) => {
  const { orderId } = req.params;

  const review = await prisma.driverReview.findUnique({
    where: {
      orderId,
    },
  });

  if (!review || review.deletedAt) {
    return next(new ErrorHandler("Driver review not found", 404));
  }

  if (review.userId !== req.user.id) {
    return next(new ErrorHandler("You are not the owner of this review", 403));
  }

  await prisma.driverReview.delete({
    where: {
      orderId,
    },
  });

  return res.status(200).json({
    message: "Driver review deleted successfully",
  });
});

const getDriverReviewById = asyncHandler(async (req, res, next) => {
  const { orderId } = req.params;

  const review = await prisma.driverReview.findFirst({
    where: {
      orderId,
      deletedAt: null,
    },
    include: {
      user: {
        select: {
          id: true,
          fullName: true,
          avatar: true,
        },
      },
      driver: {
        include: {
          user: {
            select: {
              id: true,
              fullName: true,
              phone: true,
              avatar: true,
            },
          },
        },
      },
      order: {
        include: {
          restaurant: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
  });

  if (!review) {
    return next(new ErrorHandler("Driver review not found", 404));
  }

  return res.status(200).json({
    review,
  });
});

const getDriverReviews = asyncHandler(async (req, res, next) => {
  const { driverId } = req.params;

  const features = new ApiFeatures(req.query)
    .paginate()
    .sort(["createdAt", "rating"]);

  const driver = await prisma.driver.findFirst({
    where: {
      id: driverId,
      deletedAt: null,
    },
  });

  if (!driver) {
    return next(new ErrorHandler("Driver not found", 404));
  }

  const where = {
    driverId,
    deletedAt: null,
  };

  const [reviews, total] = await prisma.$transaction([
    prisma.driverReview.findMany({
      where,
      orderBy: features.orderBy,
      skip: features.skip,
      take: features.take,
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            avatar: true,
          },
        },
        order: {
          select: {
            id: true,
          },
        },
      },
    }),

    prisma.driverReview.count({
      where,
    }),
  ]);

  return res.status(200).json({
    reviews,
    pagination: {
      page: features.pagination.page,
      limit: features.pagination.limit,
      total,
      totalPages: Math.ceil(total / features.pagination.limit),
    },
  });
});

const getMyReviews = asyncHandler(async (req, res, next) => {
  const features = new ApiFeatures(req.query)
    .paginate()
    .sort(["createdAt", "rating"]);

  const where = {
    userId: req.user.id,
    deletedAt: null,
  };

  const [reviews, total] = await prisma.$transaction([
    prisma.driverReview.findMany({
      where,
      orderBy: features.orderBy,
      skip: features.skip,
      take: features.take,
      include: {
        restaurant: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    }),

    prisma.driverReview.count({
      where,
    }),
  ]);

  return res.status(200).json({
    reviews,
    pagination: {
      page: features.pagination.page,
      limit: features.pagination.limit,
      total,
      totalPages: Math.ceil(total / features.pagination.limit),
    },
  });
});

module.exports = {
  createDriverReview,
  updateDriverReview,
  deleteDriverReview,
  getDriverReviewById,
  getDriverReviews,
  getMyReviews,
};
