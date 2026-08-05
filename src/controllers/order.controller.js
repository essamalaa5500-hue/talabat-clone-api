const asyncHandler = require("express-async-handler");
const ErrorHandler = require("../../utils/ErrorHandler");
const prisma = require("../../utils/prisma");
const apiFeatures = require("../../utils/ApiFeatures");
const notificationQueue = require("../../queues/notification.queue");
const { sendNotification } = require("../../services/notification.service");

const createOrder = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;

  const cart = await prisma.cart.findFirst({
    where: {
      userId,
      deletedAt: null,
    },
    include: {
      restaurant: true,
      branch: true,
      items: {
        where: {
          deletedAt: null,
        },
        include: {
          productVariant: {
            include: {
              product: true,
            },
          },
          options: {
            include: {
              optionValue: {
                include: {
                  productOption: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!cart) {
    return next(new ErrorHandler("Cart not found", 404));
  }

  if (!cart.items.length) {
    return next(new ErrorHandler("Cart is empty", 400));
  }
  const address = await tx.address.findFirst({
    where: {
      id: req.body.addressId,
      userId,
      deletedAt: null,
    },
  });

  if (!address) {
    throw new ErrorHandler("Address not found", 404);
  }

  let subtotal = 0;
  let discount = 0;

  for (const item of cart.items) {
    const originalPrice = Number(item.productVariant.price);

    const finalPrice = Number(
      item.productVariant.discountPrice ?? item.productVariant.price,
    );

    const optionsPrice = item.options.reduce(
      (sum, option) => sum + Number(option.extraPrice),
      0,
    );

    subtotal += (originalPrice + optionsPrice) * item.quantity;

    discount += (originalPrice - finalPrice) * item.quantity;
  }

  const deliveryFee = Number(cart.branch.deliveryFee);
  const tax = 0;
  const totalAmount = subtotal - discount + tax + deliveryFee;

  const createdOrder = await prisma.$transaction(async (tx) => {
    const order = await tx.order.create({
      data: {
        userId,
        restaurantId: cart.restaurantId,
        branchId: cart.branchId,

        subtotal,
        deliveryFee,
        discount,
        tax,
        totalAmount,

        notes: req.body?.notes ?? null,

        couponId: null,
      },
    });
    await tx.orderAddress.create({
      data: {
        orderId: order.id,

        city: address.city,
        area: address.area,
        street: address.street,

        building: address.building,
        floor: address.floor,
        apartment: address.apartment,

        latitude: address.latitude,
        longitude: address.longitude,

        notes: req.body.notes ?? null,
      },
    });

    await tx.orderStatusHistory.create({
      data: {
        orderId: order.id,
        status: "PENDING",
        changedById: userId,
      },
    });

    for (const item of cart.items) {
      const orderItem = await tx.orderItem.create({
        data: {
          orderId: order.id,

          productVariantId: item.productVariantId,

          productName: item.productVariant.product.name,

          variantName: item.productVariant.name,

          quantity: item.quantity,

          unitPrice: item.unitPrice,

          totalPrice: item.totalPrice,

          discount:
            Number(item.productVariant.price) -
            Number(
              item.productVariant.discountPrice ?? item.productVariant.price,
            ),
        },
      });

      for (const option of item.options) {
        await tx.orderItemOption.create({
          data: {
            orderItemId: orderItem.id,
            optionName: option.optionValue.name,
            extraPrice: option.extraPrice,
          },
        });
      }
    }

    await tx.cartItemOption.deleteMany({
      where: {
        cartItem: {
          cartId: cart.id,
        },
      },
    });

    await tx.cartItem.deleteMany({
      where: {
        cartId: cart.id,
      },
    });

    await tx.cart.delete({
      where: {
        id: cart.id,
      },
    });

    return await tx.order.findUnique({
      where: {
        id: order.id,
      },
      include: {
        orderStatusHistory: true,
        orderAddress: true,
        items: {
          include: {
            options: true,
          },
        },
      },
    });
  });
  await sendNotification({
    room: `user:${req.user.id}`,
    userId: req.user.id,
    orderId: createdOrder.id,
    type: "ORDER",
    title: "New Order",
    body: "You have placed a new order.",
  });

  return res.status(201).json({
    message: "Order created successfully",
    order: createdOrder,
  });
});

const getMyOrders = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;
  const features = new apiFeatures(req.query)
    .paginate()
    .search(["status"])
    .sort(["createdAt", "status"]);

  const where = {
    ...features.where,
    userId,
    deletedAt: null,
  };

  const [orders, total] = await prisma.$transaction([
    prisma.order.findMany({
      where,
      orderBy: features.orderBy,
      skip: features.skip,
      take: features.take,
      include: {
        orderStatusHistory: true,
        orderAddress: true,
        items: {
          include: {
            productVariant: {
              include: {
                product: true,
              },
            },
            options: {
              select: {
                id: true,
                optionName: true,
                extraPrice: true,
              },
            },
          },
        },
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

const getOrderById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const order = await prisma.order.findFirst({
    where: {
      id,
      userId: req.user.id,
      deletedAt: null,
    },
    include: {
      orderStatusHistory: true,
      orderAddress: true,

      items: {
        include: {
          productVariant: {
            include: {
              product: true,
            },
          },
          options: {
            select: {
              id: true,
              optionName: true,
              extraPrice: true,
            },
          },
        },
      },

      coupon: {
        select: {
          id: true,
          code: true,
          name: true,
          type: true,
          value: true,
        },
      },

      delivery: true,

      payment: {
        select: {
          paymentMethod: true,
          status: true,
          amount: true,
          currency: true,
          transactionId: true,
          paidAt: true,
        },
      },
    },
  });

  if (!order) {
    return next(new ErrorHandler("Order not found", 404));
  }

  return res.status(200).json({
    order,
  });
});

const cancelOrder = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const order = await prisma.order.findFirst({
    where: {
      id,
      userId: req.user.id,
      deletedAt: null,
    },
  });

  if (!order) {
    return next(new ErrorHandler("Order not found", 404));
  }

  const cancellableStatuses = ["PENDING", "CONFIRMED"];

  if (!cancellableStatuses.includes(order.status)) {
    return next(new ErrorHandler("This order can no longer be cancelled", 400));
  }

  await prisma.$transaction(async (tx) => {
    await tx.order.update({
      where: { id },
      data: {
        status: "CANCELLED",
      },
    });

    await tx.orderStatusHistory.create({
      data: {
        orderId: id,
        status: "CANCELLED",
        changedById: req.user.id,
      },
    });
  });
  await sendNotification({
    room: `user:${req.user.id}`,
    userId: req.user.id,
    orderId: order.id,
    type: "ORDER",
    title: "Order Cancelled",
    body: "Your order has been CANCELLED.",
  });

  return res.status(200).json({
    message: "Order cancelled successfully",
  });
});

const getRestaurantOrders = asyncHandler(async (req, res, next) => {
  const features = new apiFeatures(req.query)
    .paginate()
    .sort(["createdAt", "status"]);

  const restaurant = await prisma.restaurant.findFirst({
    where: {
      ownerId: req.user.id,
      deletedAt: null,
    },
  });

  if (!restaurant) {
    return next(new ErrorHandler("Restaurant not found", 404));
  }

  const where = {
    restaurantId: restaurant.id,
    deletedAt: null,
  };

  if (req.query.status) {
    where.status = req.query.status;
  }

  const [orders, total] = await prisma.$transaction([
    prisma.order.findMany({
      where,
      orderBy: features.orderBy,
      skip: features.skip,
      take: features.take,
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            phone: true,
          },
        },
        orderStatusHistory: true,
        orderAddress: true,
        items: {
          include: {
            productVariant: {
              include: {
                product: true,
              },
            },
            options: {
              select: {
                id: true,
                optionName: true,
                extraPrice: true,
              },
            },
          },
        },
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

const acceptOrder = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
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
      id,
      restaurantId: restaurant.id,
      deletedAt: null,
    },
  });

  if (!order) {
    return next(new ErrorHandler("Order not found", 404));
  }

  if (order.status !== "PENDING") {
    return next(new ErrorHandler("Only pending orders can be accepted", 400));
  }

  await prisma.$transaction(async (tx) => {
    await tx.order.update({
      where: { id },
      data: {
        status: "CONFIRMED",
      },
    });

    await tx.orderStatusHistory.create({
      data: {
        orderId: id,
        status: "CONFIRMED",
        changedById: req.user.id,
      },
    });
  });
  await sendNotification({
    room: `user:${req.user.id}`,
    userId: req.user.id,
    orderId: order.id,
    type: "ORDER",
    title: "Order Accepted",
    body: "Your order has been ACCEPTED.",
  });

  return res.status(200).json({
    message: "Order accepted successfully",
  });
});

const rejectOrder = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

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
      id,
      restaurantId: restaurant.id,
      deletedAt: null,
    },
  });

  if (!order) {
    return next(new ErrorHandler("Order not found", 404));
  }

  if (order.status !== "PENDING") {
    return next(new ErrorHandler("Only pending orders can be rejected", 400));
  }

  await prisma.$transaction(async (tx) => {
    await tx.order.update({
      where: { id },
      data: {
        status: "REJECTED",
      },
    });

    await prisma.orderStatusHistory.create({
      data: {
        orderId: id,
        status: "REJECTED",
        changedById: req.user.id,
      },
    });
  });

  await sendNotification({
    room: `user:${req.user.id}`,
    userId: req.user.id,
    orderId: order.id,
    type: "ORDER",
    title: "Order Rejected",
    body: "Your order has been REJECTED.",
  });

  return res.status(200).json({
    message: "Order rejected successfully",
  });
});

const preparingOrder = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
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
      id,
      restaurantId: restaurant.id,
      deletedAt: null,
    },
  });

  if (!order) {
    return next(new ErrorHandler("Order not found", 404));
  }

  if (order.status !== "CONFIRMED") {
    return next(new ErrorHandler("Only confirmed orders can be prepared", 400));
  }

  await prisma.$transaction(async (tx) => {
    await tx.order.update({
      where: { id },
      data: {
        status: "PREPARING",
      },
    });

    await prisma.orderStatusHistory.create({
      data: {
        orderId: id,
        status: "PREPARING",
        changedById: req.user.id,
      },
    });
  });
  await sendNotification({
    room: `user:${req.user.id}`,
    userId: req.user.id,
    orderId: order.id,
    type: "ORDER",
    title: "Order Preparing",
    body: "Your order is now being prepared.",
  });
  return res.status(200).json({
    message: "Order is now being prepared",
  });
});

const readyOrder = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
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
      id,
      restaurantId: restaurant.id,
      deletedAt: null,
    },
  });

  if (!order) {
    return next(new ErrorHandler("Order not found", 404));
  }

  if (order.status !== "PREPARING") {
    return next(
      new ErrorHandler(
        "Only orders in PREPARING status can be marked as READY",
        400,
      ),
    );
  }

  await prisma.$transaction(async (tx) => {
    await tx.order.update({
      where: { id },
      data: {
        status: "READY",
      },
    });

    await prisma.orderStatusHistory.create({
      data: {
        orderId: id,
        status: "READY",
        changedById: req.user.id,
      },
    });
  });
  await sendNotification({
    room: `user:${req.user.id}`,
    userId: req.user.id,
    orderId: order.id,
    type: "ORDER",
    title: "Order Ready",
    body: "Your order has been READY.",
  });

  return res.status(200).json({
    message: "Order is now ready",
  });
});

const assignDriver = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { driverId } = req.body;

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
      id,
      restaurantId: restaurant.id,
      deletedAt: null,
    },
  });

  if (!order) {
    return next(new ErrorHandler("Order not found", 404));
  }

  if (order.status !== "READY") {
    return next(
      new ErrorHandler(
        "Only orders in READY status can be assigned to a driver",
        400,
      ),
    );
  }

  const driver = await prisma.driver.findFirst({
    where: {
      id: driverId,
      deletedAt: null,
    },
  });

  if (!driver) {
    return next(new ErrorHandler("Driver not found", 404));
  }

  await prisma.$transaction(async (tx) => {
    await tx.order.update({
      where: {
        id,
      },
      data: {
        driverId,
        status: "ASSIGNED",
      },
    });

    await prisma.orderStatusHistory.create({
      data: {
        orderId: id,
        status: "ASSIGNED",
        changedById: req.user.id,
      },
    });
  });
  await sendNotification({
    room: `user:${req.user.id}`,
    userId: req.user.id,
    orderId: order.id,
    type: "ORDER",
    title: "Driver Assigned",
    body: "A driver has been ASSIGNED to your order.",
  });

  return res.status(200).json({
    message: "Driver assigned successfully",
  });
});

const pickUpOrder = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

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
      id,
      deletedAt: null,
    },
  });

  if (!order) {
    return next(new ErrorHandler("Order not found", 404));
  }

  if (order.status !== "ASSIGNED") {
    return next(
      new ErrorHandler("Only orders in ASSIGNED status can be picked up", 400),
    );
  }

  if (!order.driverId) {
    return next(new ErrorHandler("No driver assigned to this order", 400));
  }

  if (order.driverId !== driver.id) {
    return next(new ErrorHandler("This order is not assigned to you", 403));
  }

  await prisma.$transaction(async (tx) => {
    await tx.order.update({
      where: {
        id,
      },
      data: {
        status: "ON_THE_WAY",
      },
    });

    await prisma.orderStatusHistory.create({
      data: {
        orderId: id,
        status: "ON_THE_WAY",
        changedById: req.user.id,
      },
    });
  });

  await sendNotification({
    room: `user:${req.user.id}`,
    userId: req.user.id,
    orderId: order.id,
    type: "ORDER",
    title: "Order Picked Up",
    body: "Your order has been PICKED UP.",
  });

  return res.status(200).json({
    message: "Order picked up successfully",
  });
});

const deliverOrder = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

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
      id,
      deletedAt: null,
    },
  });

  if (!order) {
    return next(new ErrorHandler("Order not found", 404));
  }

  if (order.status !== "ON_THE_WAY") {
    return next(
      new ErrorHandler(
        "Only orders in ON_THE_WAY status can be delivered",
        400,
      ),
    );
  }

  if (!order.driverId) {
    return next(new ErrorHandler("No driver assigned to this order", 400));
  }

  if (order.driverId !== driver.id) {
    return next(new ErrorHandler("This order is not assigned to you", 403));
  }

  await prisma.$transaction(async (tx) => {
    await tx.order.update({
      where: { id },
      data: {
        status: "DELIVERED",
      },
    });

    await prisma.orderStatusHistory.create({
      data: {
        orderId: id,
        status: "DELIVERED",
        changedById: req.user.id,
      },
    });
  });

  await sendNotification({
    room: `user:${driver.userId}`,
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

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
  cancelOrder,
  getRestaurantOrders,
  acceptOrder,
  rejectOrder,
  preparingOrder,
  readyOrder,
  assignDriver,
  pickUpOrder,
  deliverOrder,
};
