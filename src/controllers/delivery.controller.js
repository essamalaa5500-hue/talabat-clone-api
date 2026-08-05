const asyncHandler = require("express-async-handler");
const ErrorHandler = require("../../utils/ErrorHandler");
const prisma = require("../../utils/prisma");
const ApiFeatures = require("../../utils/ApiFeatures");
const notificationQueue = require("../../queues/notification.queue");
const { sendNotification } = require("../../services/notification.service");

const assignDriver = asyncHandler(async (req, res, next) => {
  const { orderId } = req.params;
  const { userId } = req.body;

  const restaurant = await prisma.restaurant.findFirst({
    where: {
      ownerId: req.user.id,
      deletedAt: null,
    },
  });

  if (!restaurant) {
    return next(new ErrorHandler("Restaurant not found", 404));
  }

  const order = await prisma.order.findFirst({
    where: {
      id: orderId,
      restaurantId: restaurant.id,
      deletedAt: null,
    },
  });

  if (!order) {
    return next(new ErrorHandler("Order not found", 404));
  }

  if (order.status !== "READY") {
    return next(
      new ErrorHandler("Only READY orders can be assigned to a driver", 400),
    );
  }

  const driver = await prisma.driver.findFirst({
    where: {
      userId,
      deletedAt: null,
    },
  });

  if (!driver) {
    return next(new ErrorHandler("Driver not found", 404));
  }

  if (driver.status !== "AVAILABLE") {
    return next(new ErrorHandler("Driver is not available", 400));
  }

  const activeOrder = await prisma.order.findFirst({
    where: {
      driverId: driver.id,
      deletedAt: null,
      status: {
        in: ["ASSIGNED", "ON_THE_WAY"],
      },
    },
  });

  if (activeOrder) {
    return next(new ErrorHandler("Driver already has an active order", 400));
  }

  await prisma.$transaction(async (tx) => {
    await tx.order.update({
      where: {
        id: orderId,
      },
      data: {
        driverId: driver.id,
        status: "ASSIGNED",
      },
    });

    await tx.driver.update({
      where: {
        id: driver.id,
      },
      data: {
        status: "BUSY",
      },
    });

    await tx.orderStatusHistory.create({
      data: {
        orderId,
        status: "ASSIGNED",
        changedById: req.user.id,
      },
    });
  });

  await sendNotification({
    room: `driver:${order.userId}`,
    userId: order.userId,
    orderId: order.id,
    type: "ORDER",
    title: "Driver Assigned",
    body: "A driver has been assigned to your order.",
  });

  await sendNotification({
    room: `driver:${driver.userId}`,
    userId: driver.userId,
    orderId: order.id,
    type: "DELIVERY",
    title: "New Delivery",
    body: "You have been assigned a new delivery.",
  });

  return res.status(200).json({
    message: "Driver assigned successfully",
  });
});

const pickUpOrder = asyncHandler(async (req, res, next) => {
  const { orderId } = req.params;

  const driver = await prisma.driver.findFirst({
    where: {
      userId: req.user.id,
      deletedAt: null,
    },
  });

  if (!driver) {
    return next(new ErrorHandler("Driver not found", 404));
  }

  const order = await prisma.order.findFirst({
    where: {
      id: orderId,
      driverId: driver.id,
      deletedAt: null,
    },
  });

  if (!order) {
    return next(new ErrorHandler("Order not found", 404));
  }

  if (order.status !== "ASSIGNED") {
    return next(new ErrorHandler("Only ASSIGNED orders can be picked up", 400));
  }

  await prisma.$transaction(async (tx) => {
    await tx.order.update({
      where: {
        id: orderId,
      },
      data: {
        status: "ON_THE_WAY",
      },
    });

    await tx.driver.update({
      where: {
        id: driver.id,
      },
      data: {
        status: "BUSY",
      },
    });

    await tx.orderStatusHistory.create({
      data: {
        orderId,
        status: "ON_THE_WAY",
        changedById: req.user.id,
      },
    });
  });

  await sendNotification({
    room: `driver:${order.userId}`,
    userId: order.userId,
    orderId: order.id,
    type: "ORDER",
    title: "Driver Assigned",
    body: "A driver has been PICKED UP your order.",
  });

  res.status(200).json({
    message: "Order picked up successfully",
  });
});

const deliverOrder = asyncHandler(async (req, res, next) => {
  const { orderId } = req.params;

  const driver = await prisma.driver.findFirst({
    where: {
      userId: req.user.id,
      deletedAt: null,
    },
  });

  if (!driver) {
    return next(new ErrorHandler("Driver not found", 404));
  }

  const order = await prisma.order.findFirst({
    where: {
      id: orderId,
      driverId: driver.id,
      deletedAt: null,
    },
  });

  if (!order) {
    return next(new ErrorHandler("Order not found", 404));
  }

  if (order.status !== "ON_THE_WAY") {
    return next(
      new ErrorHandler("Only ON_THE_WAY orders can be delivered", 400),
    );
  }

  await prisma.$transaction(async (tx) => {
    await tx.order.update({
      where: {
        id: orderId,
      },
      data: {
        status: "DELIVERED",
      },
    });

    await tx.orderStatusHistory.create({
      data: {
        orderId,
        status: "DELIVERED",
        changedById: req.user.id,
      },
    });

    await tx.payment.updateMany({
      where: {
        orderId,
        paymentMethod: "CASH",
        status: "PENDING",
      },
      data: {
        status: "PAID",
        paidAt: new Date(),
      },
    });

    await tx.driver.update({
      where: {
        id: driver.id,
      },
      data: {
        status: "AVAILABLE",
      },
    });

    await tx.delivery.updateMany({
      where: {
        orderId,
      },
      data: {
        status: "DELIVERED",
      },
    });
  });

  await sendNotification({
    room: `driver:${driver.userId}`,
    userId: driver.userId,
    orderId: order.id,
    type: "DELIVERY",
    title: "New Delivery",
    body: "You have been DELIVERED a new order.",
  });

  return res.status(200).json({
    message: "Order delivered successfully",
  });
});

const getMyDeliveries = asyncHandler(async (req, res, next) => {
  const features = new ApiFeatures(req.query)
    .paginate()
    .sort(["createdAt", "status"]);

  const driver = await prisma.driver.findFirst({
    where: {
      userId: req.user.id,
      deletedAt: null,
    },
  });

  if (!driver) {
    return next(new ErrorHandler("Driver not found", 404));
  }

  const where = {
    driverId: driver.id,
    status: "DELIVERED",
    deletedAt: null,
  };
  const [orders, total] = await prisma.$transaction([
    prisma.order.findMany({
      where,
      orderBy: features.orderBy,
      skip: features.skip,
      take: features.take,
      include: {
        user: {
          select: {
            fullName: true,
            phone: true,
          },
        },
        restaurant: {
          select: {
            id: true,
            name: true,
          },
        },

        branch: {
          select: {
            id: true,
            name: true,
            phone: true,
          },
        },
        orderAddress: true,
        payment: true,
        items: {
          include: {
            productVariant: {
              include: {
                product: true,
              },
            },
            options: true,
          },
        },
      },
    }),

    prisma.order.count({
      where,
    }),
  ]);

  return res.status(200).json({
    orders,
    pagination: {
      page: features.pagination.page,
      limit: features.pagination.limit,
      total,
      totalPages: Math.ceil(total / features.pagination.limit),
    },
  });
});

const getDeliveryById = asyncHandler(async (req, res, next) => {
  const { orderId } = req.params;

  const driver = await prisma.driver.findFirst({
    where: {
      userId: req.user.id,
      deletedAt: null,
    },
  });

  if (!driver) {
    return next(new ErrorHandler("Driver not found", 404));
  }

  const order = await prisma.order.findUnique({
    where: {
      id: orderId,
    },
    include: {
      user: {
        select: {
          fullName: true,
          phone: true,
        },
      },
      restaurant: {
        select: {
          id: true,
          name: true,
        },
      },

      branch: {
        select: {
          id: true,
          name: true,
          phone: true,
        },
      },
      orderAddress: true,
      orderStatusHistory: {
        orderBy: {
          createdAt: "asc",
        },
      },
      payment: true,
      items: {
        include: {
          productVariant: {
            include: {
              product: true,
            },
          },
          options: true,
        },
      },
    },
  });

  if (!order || order.deletedAt) {
    return next(new ErrorHandler("Order not found", 404));
  }

  if (order.driverId !== driver.id) {
    return next(new ErrorHandler("You are not assigned to this order", 403));
  }

  return res.status(200).json({
    order,
  });
});

const getDriverCurrentOrders = asyncHandler(async (req, res, next) => {
  const features = new ApiFeatures(req.query).paginate().sort(["createdAt"]);

  const driver = await prisma.driver.findFirst({
    where: {
      userId: req.user.id,
      deletedAt: null,
    },
  });

  if (!driver) {
    return next(new ErrorHandler("Driver not found", 404));
  }

  const where = {
    driverId: driver.id,
    status: {
      in: ["ASSIGNED", "ON_THE_WAY"],
    },
    deletedAt: null,
  };

  const [orders, total] = await prisma.$transaction([
    prisma.order.findMany({
      where,
      orderBy: features.orderBy,
      skip: features.skip,
      take: features.take,
      include: {
        user: {
          select: {
            fullName: true,
            phone: true,
          },
        },
        restaurant: {
          select: {
            name: true,
          },
        },
        orderAddress: true,
        payment: true,
      },
    }),

    prisma.order.count({ where }),
  ]);

  return res.status(200).json({
    orders,
    pagination: {
      page: features.pagination.page,
      limit: features.pagination.limit,
      total,
      totalPages: Math.ceil(total / features.pagination.limit),
    },
  });
});

const cancelDelivery = asyncHandler(async (req, res, next) => {
  const { orderId } = req.params;

  const driver = await prisma.driver.findFirst({
    where: {
      userId: req.user.id,
      deletedAt: null,
    },
  });

  if (!driver) {
    return next(new ErrorHandler("Driver not found", 404));
  }

  const order = await prisma.order.findFirst({
    where: {
      id: orderId,
      driverId: driver.id,
      deletedAt: null,
    },
  });

  if (!order) {
    return next(new ErrorHandler("Order not found", 404));
  }

  if (!["ASSIGNED", "ON_THE_WAY"].includes(order.status)) {
    return next(
      new ErrorHandler(
        "Only ASSIGNED or ON_THE_WAY orders can cancel delivery",
        400,
      ),
    );
  }

  await prisma.$transaction(async (tx) => {
    await tx.order.update({
      where: {
        id: orderId,
      },
      data: {
        driverId: null,
        status: "READY",
      },
    });

    await tx.orderStatusHistory.create({
      data: {
        orderId,
        status: "READY",
        changedById: req.user.id,
      },
    });
  });
  await tx.driver.update({
    where: { id: driver.id },
    data: {
      status: "AVAILABLE",
    },
  });
  await sendNotification({
    room: `driver:${driver.userId}`,
    userId: driver.userId,
    orderId: order.id,
    type: "DELIVERY",
    title: "New Delivery",
    body: "You have been CANCELLED a new order.",
  });

  return res.status(200).json({
    message: "Delivery cancelled successfully",
  });
});

module.exports = {
  assignDriver,
  pickUpOrder,
  deliverOrder,
  getMyDeliveries,
  getDeliveryById,
  getDriverCurrentOrders,
  cancelDelivery,
};
