const asyncHandler = require("express-async-handler");
const ErrorHandler = require("../../utils/ErrorHandler");
const prisma = require("../../utils/prisma");
const ApiFeatures = require("../../utils/ApiFeatures");

const createRestaurantReview = asyncHandler(async (req, res, next) => {
  const { orderId } = req.params;
  const { rating, comment } = req.body;

  const order = await prisma.order.findFirst({
    where: {
      id: orderId,
      userId: req.user.id,
      status: "DELIVERED",
      deletedAt: null,
    },
    select: {
      id: true,
      restaurantId: true,
      restaurant: {
        select: {
          ownerId: true,
        },
      },
    },
  });

  if (!order) {
    return next(new ErrorHandler("Delivered order not found", 404));
  }

  const existingReview = await prisma.restaurantReview.findFirst({
    where: {
      orderId,
      deletedAt: null,
    },
  });

  if (existingReview) {
    return next(new ErrorHandler("You already reviewed this order", 400));
  }

  const review = await prisma.restaurantReview.create({
    data: {
      rating,
      comment,
      orderId,
      restaurantId: order.restaurantId,
      userId: req.user.id,
    },
  });

  if (order.restaurant?.ownerId) {
    await prisma.notification.create({
      data: {
        userId: order.restaurant.ownerId,
        type: "REVIEW",
        title: "New Restaurant Review",
        body: `A new ${rating}-star review was posted for your restaurant.`,
      },
    });
  }

  return res.status(201).json({
    message: "Restaurant review created successfully",
    review,
  });
});

const updateRestaurantReview = asyncHandler(async (req, res, next) => {
  const { orderId } = req.params;
  const { rating, comment } = req.body;

  const review = await prisma.restaurantReview.findFirst({
    where: {
      orderId,
      deletedAt: null,
    },
  });

  if (!review) {
    return next(new ErrorHandler("Restaurant review not found", 404));
  }

  if (review.userId !== req.user.id) {
    return next(new ErrorHandler("You are not the owner of this review", 403));
  }

  const updatedReview = await prisma.restaurantReview.update({
    where: { id: review.id },
    data: {
      rating,
      comment,
    },
  });

  return res.status(200).json({
    message: "Restaurant review updated successfully",
    review: updatedReview,
  });
});

const deleteRestaurantReview = asyncHandler(async (req, res, next) => {
  const { orderId } = req.params;

  const review = await prisma.restaurantReview.findFirst({
    where: {
      orderId,
      deletedAt: null,
    },
  });

  if (!review) {
    return next(new ErrorHandler("Restaurant review not found", 404));
  }

  if (review.userId !== req.user.id) {
    return next(new ErrorHandler("You are not the owner of this review", 403));
  }

  await prisma.restaurantReview.update({
    where: { id: review.id },
    data: {
      deletedAt: new Date(),
    },
  });

  return res.status(200).json({
    message: "Restaurant review deleted successfully",
  });
});

const getRestaurantReviewById = asyncHandler(async (req, res, next) => {
  const { orderId } = req.params;

  const review = await prisma.restaurantReview.findFirst({
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
      restaurant: {
        select: {
          id: true,
          name: true,
        },
      },
      order: {
        select: {
          id: true,
          status: true,
        },
      },
    },
  });

  if (!review) {
    return next(new ErrorHandler("Restaurant review not found", 404));
  }

  return res.status(200).json({
    review,
  });
});

const getRestaurantReviews = asyncHandler(async (req, res, next) => {
  const { restaurantId } = req.params;

  const features = new ApiFeatures(req.query)
    .paginate()
    .sort(["createdAt", "rating"]);

  const restaurant = await prisma.restaurant.findFirst({
    where: {
      id: restaurantId,
      deletedAt: null,
    },
  });

  if (!restaurant) {
    return next(new ErrorHandler("Restaurant not found", 404));
  }

  const where = {
    restaurantId,
    deletedAt: null,
  };

  const [reviews, total] = await prisma.$transaction([
    prisma.restaurantReview.findMany({
      where,
      orderBy: features.orderBy,
      skip: features.skip,
      take: features.take,
      include: {
        user: {
          select: {
            fullName: true,
            avatar: true,
          },
        },
      },
    }),

    prisma.restaurantReview.count({ where }),
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
    prisma.restaurantReview.findMany({
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
        order: {
          select: {
            id: true,
          },
        },
      },
    }),

    prisma.restaurantReview.count({
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
  createRestaurantReview,
  updateRestaurantReview,
  deleteRestaurantReview,
  getRestaurantReviewById,
  getRestaurantReviews,
  getMyReviews,
};
