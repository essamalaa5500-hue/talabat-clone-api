const asyncHandler = require("express-async-handler");
const ErrorHandler = require("../../utils/ErrorHandler");
const prisma = require("../../utils/prisma");
const ApiFeatures = require("../../utils/ApiFeatures");

const getMyNotifications = asyncHandler(async (req, res, next) => {
  const features = new ApiFeatures(req.query)
    .paginate()
    .sort(["createdAt", "readAt"]);

  const where = {
    userId: req.user.id,
    deletedAt: null,
  };

  const [notifications, total] = await prisma.$transaction([
    prisma.notification.findMany({
      where,
      orderBy: features.orderBy,
      skip: features.skip,
      take: features.take,
      include: {
        order: {
          select: {
            id: true,
            status: true,
          },
        },
      },
    }),

    prisma.notification.count({
      where,
    }),
  ]);

  return res.status(200).json({
    notifications,
    pagination: {
      page: features.pagination.page,
      limit: features.pagination.limit,
      total,
      totalPages: Math.ceil(total / features.pagination.limit),
    },
  });
});

const getNotificationById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const notification = await prisma.notification.findFirst({
    where: {
      id,
      userId: req.user.id,
      deletedAt: null,
    },
    include: {
      order: {
        select: {
          id: true,
          status: true,
        },
      },
    },
  });

  if (!notification) {
    return next(new ErrorHandler("Notification not found", 404));
  }

  return res.status(200).json({
    notification,
  });
});

const markAsRead = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const notification = await prisma.notification.findFirst({
    where: {
      id,
      userId: req.user.id,
      deletedAt: null,
    },
  });

  if (!notification) {
    return next(new ErrorHandler("Notification not found", 404));
  }

  await prisma.notification.update({
    where: {
      id,
    },
    data: {
      isRead: true,
      readAt: new Date(),
    },
  });

  return res.status(200).json({
    message: "Notification marked as read successfully",
  });
});

const markAllAsRead = asyncHandler(async (req, res, next) => {
  const where = {
    userId: req.user.id,
    deletedAt: null,
  };

  await prisma.notification.updateMany({
    where,
    data: {
      isRead: true,
      readAt: new Date(),
    },
  });

  return res.status(200).json({
    message: "All notifications marked as read successfully",
  });
});

const deleteNotification = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const notification = await prisma.notification.findFirst({
    where: {
      id,
      userId: req.user.id,
      deletedAt: null,
    },
  });

  if (!notification) {
    return next(new ErrorHandler("Notification not found", 404));
  }

  await prisma.notification.update({
    where: {
      id,
    },
    data: {
      deletedAt: new Date(),
    },
  });

  return res.status(200).json({
    message: "Notification deleted successfully",
  });
});

module.exports = {
  getMyNotifications,
  getNotificationById,
  markAsRead,
  markAllAsRead,
  deleteNotification,
};
