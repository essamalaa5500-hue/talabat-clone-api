const express = require("express");

const {
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
} = require("../controllers/order.controller");

const verifyToken = require("../../middlewares/verifyToken");
const authorize = require("../../middlewares/authorize");

const {
  createOrderValidation,
  assignDriverValidation,
} = require("../../middlewares/order-validation");

const router = express.Router();

router.post(
  "/",
  verifyToken,
  authorize("CUSTOMER"),
  createOrderValidation,
  createOrder,
);

router.get("/my-orders", verifyToken, authorize("CUSTOMER"), getMyOrders);

router.get("/:id", verifyToken, getOrderById);

router.patch("/:id/cancel", verifyToken, authorize("CUSTOMER"), cancelOrder);

router.get(
  "/restaurant/orders",
  verifyToken,
  authorize("RESTAURANT_OWNER"),
  getRestaurantOrders,
);

router.patch(
  "/:id/accept",
  verifyToken,
  authorize("RESTAURANT_OWNER"),
  acceptOrder,
);

router.patch(
  "/:id/reject",
  verifyToken,
  authorize("RESTAURANT_OWNER"),
  rejectOrder,
);

router.patch(
  "/:id/preparing",
  verifyToken,
  authorize("RESTAURANT_OWNER"),
  preparingOrder,
);

router.patch(
  "/:id/ready",
  verifyToken,
  authorize("RESTAURANT_OWNER"),
  readyOrder,
);

router.patch(
  "/:id/assign-driver",
  verifyToken,
  authorize("RESTAURANT_OWNER"),
  assignDriverValidation,
  assignDriver,
);

router.patch("/:id/pick-up", verifyToken, authorize("DRIVER"), pickUpOrder);

router.patch("/:id/delivered", verifyToken, authorize("DRIVER"), deliverOrder);

module.exports = router;
