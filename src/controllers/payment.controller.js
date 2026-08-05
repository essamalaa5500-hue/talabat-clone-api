const asyncHandler = require("express-async-handler");
const ErrorHandler = require("../../utils/ErrorHandler");
const prisma = require("../../utils/prisma");
const crypto = require("crypto");
const { getIO } = require("../../socket/socket");
const { sendNotification } = require("../../services/notification.service");

const createPayment = asyncHandler(async (req, res, next) => {
  const { orderId } = req.params;
  const { paymentMethod } = req.body;

  const order = await prisma.order.findFirst({
    where: {
      id: orderId,
      userId: req.user.id,
      deletedAt: null,
    },
  });

  if (!order) {
    return next(new ErrorHandler("Order not found", 404));
  }

  if (order.status !== "CONFIRMED") {
    return next(new ErrorHandler("Only confirmed orders can be paid", 400));
  }

  const existingPayment = await prisma.payment.findUnique({
    where: {
      orderId,
    },
  });

  if (existingPayment) {
    return next(new ErrorHandler("Payment already exists", 400));
  }

  if (!paymentMethod || !["CASH", "CARD", "WALLET"].includes(paymentMethod)) {
    return next(new ErrorHandler("Invalid payment method", 400));
  }

  const payment = await prisma.payment.create({
    data: {
      orderId,
      paymentMethod,
      amount: order.totalAmount,
      currency: "EGP",
      status: "PENDING",
    },
  });

  await sendNotification({
    room: `user:${order.userId}`,
    userId: order.userId,
    orderId: order.id,
    type: "PAYMENT",
    title: "Payment Created",
    body: "Your payment request has been created successfully.",
  });

  res.status(201).json({
    message: "Payment created successfully",
    payment,
  });
});

const updatePaymentStatus = asyncHandler(async (req, res, next) => {
  const { paymentId } = req.params;
  const { status } = req.body;

  if (!["PAID", "FAILED", "REFUNDED"].includes(status)) {
    return next(new ErrorHandler("Invalid payment status", 400));
  }

  const payment = await prisma.payment.findUnique({
    where: { id: paymentId },

    include: {
      order: true,
    },
  });

  if (!payment) {
    return next(new ErrorHandler("Payment not found", 404));
  }

  if (payment.status === status) {
    return next(new ErrorHandler("Payment already has this status", 400));
  }

  if (payment.status === "PENDING") {
    if (!["PAID", "FAILED"].includes(status)) {
      return next(
        new ErrorHandler("Pending payment can only become PAID or FAILED", 400),
      );
    }
  }

  if (payment.status === "PAID") {
    if (status !== "REFUNDED") {
      return next(
        new ErrorHandler("Paid payment can only become REFUNDED", 400),
      );
    }
  }

  if (["FAILED", "REFUNDED"].includes(payment.status)) {
    return next(new ErrorHandler("This payment can no longer be updated", 400));
  }

  const data = {
    status,
  };

  if (status === "PAID") {
    data.paidAt = new Date();
    data.transactionId = crypto.randomUUID();
  }

  await prisma.payment.update({
    where: {
      id: paymentId,
    },
    data,
  });

  await sendNotification({
    room: `user:${payment.order.userId}`,
    userId: payment.order.userId,
    orderId: payment.order.id,
    type: "PAYMENT",
    title: "Payment Status Updated",
    body: "Your payment status has been updated successfully.",
  });

  return res.status(200).json({
    message: "Payment status updated successfully",
  });
});

const getPaymentById = asyncHandler(async (req, res, next) => {
  const { paymentId } = req.params;

  const payment = await prisma.payment.findUnique({
    where: {
      id: paymentId,
    },
    include: {
      order: {
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
      },
    },
  });

  if (!payment) {
    return next(new ErrorHandler("Payment not found", 404));
  }

  return res.status(200).json({
    payment,
  });
});

const getPaymentByOrderId = asyncHandler(async (req, res, next) => {
  const { orderId } = req.params;

  const payment = await prisma.payment.findUnique({
    where: {
      orderId,
    },
    include: {
      order: {
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
      },
    },
  });

  if (!payment) {
    return next(new ErrorHandler("Payment not found", 404));
  }

  return res.status(200).json({
    payment,
  });
});

module.exports = {
  createPayment,
  updatePaymentStatus,
  getPaymentById,
  getPaymentByOrderId,
};
