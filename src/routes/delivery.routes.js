const express = require("express");
const router = express.Router();

const {
  assignDriverValidation,
  pickUpOrderValidation,
  deliverOrderValidation,
  getDeliveryByIdValidation,
  cancelDeliveryValidation,
} = require("../../middlewares/delivery-validation");

const {
  assignDriver,
  pickUpOrder,
  deliverOrder,
  getMyDeliveries,
  getDeliveryById,
  getDriverCurrentOrders,
  cancelDelivery,
} = require("../controllers/delivery.controller");

const authorize = require("../../middlewares/authorize");
const verifyToken = require("../../middlewares/verifyToken");

router.patch(
  "/assign-driver/:orderId",
  verifyToken,
  authorize("RESTAURANT_OWNER"),
  assignDriverValidation,
  assignDriver,
);

router.patch(
  "/pickup/:orderId",
  verifyToken,
  authorize("DRIVER"),
  pickUpOrderValidation,
  pickUpOrder,
);

router.patch(
  "/deliver/:orderId",
  verifyToken,
  authorize("DRIVER"),
  deliverOrderValidation,
  deliverOrder,
);

router.patch(
  "/cancel/:orderId",
  verifyToken,
  authorize("DRIVER"),
  cancelDeliveryValidation,
  cancelDelivery,
);

router.get("/my-deliveries", verifyToken, authorize("DRIVER"), getMyDeliveries);

router.get(
  "/current",
  verifyToken,
  authorize("DRIVER"),
  getDriverCurrentOrders,
);

router.get(
  "/:orderId",
  verifyToken,
  authorize("DRIVER"),
  getDeliveryByIdValidation,
  getDeliveryById,
);
module.exports = router;
