const express = require("express");

const {
  createPayment,
  updatePaymentStatus,
  getPaymentById,
  getPaymentByOrderId,
} = require("../controllers/payment.controller");

const {
  createPaymentValidation,
  updatePaymentStatusValidation,
} = require("../../middlewares/payment-validation");

const authorize = require("../../middlewares/authorize");
const verifyToken = require("../../middlewares/verifyToken");

const router = express.Router();

router.post(
  "/:orderId",
  verifyToken,
  authorize("CUSTOMER"),
  createPaymentValidation,
  createPayment,
);

router.get(
  "/:paymentId",
  verifyToken,
  authorize("CUSTOMER", "RESTAURANT_OWNER", "ADMIN"),
  getPaymentById,
);

router.get(
  "/order/:orderId",
  verifyToken,
  authorize("CUSTOMER", "RESTAURANT_OWNER", "ADMIN"),
  getPaymentByOrderId,
);

router.patch(
  "/:paymentId/status",
  verifyToken,
  authorize("ADMIN"),
  updatePaymentStatusValidation,
  updatePaymentStatus,
);

module.exports = router;
