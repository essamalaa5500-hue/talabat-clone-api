const express = require("express");
const router = express.Router();

const {
  getMyNotifications,
  getNotificationById,
  markAsRead,
  markAllAsRead,
  deleteNotification,
} = require("../controllers/notification.controller");

const verifyToken = require("../../middlewares/verifyToken");
const authorize = require("../../middlewares/authorize");
const paramsValidation = require("../../middlewares/paramsValidation");

router.get(
  "/my",
  verifyToken,
  authorize("CUSTOMER", "RESTAURANT_OWNER", "DRIVER", "ADMIN"),
  getMyNotifications,
);

router.get(
  "/:id",
  verifyToken,
  authorize("CUSTOMER", "RESTAURANT_OWNER", "DRIVER", "ADMIN"),
  paramsValidation(["id"]),
  getNotificationById,
);

router.patch(
  "/:id/read",
  verifyToken,
  authorize("CUSTOMER", "RESTAURANT_OWNER", "DRIVER", "ADMIN"),
  paramsValidation(["id"]),
  markAsRead,
);

router.patch(
  "/read",
  verifyToken,
  authorize("CUSTOMER", "RESTAURANT_OWNER", "DRIVER", "ADMIN"),
  markAllAsRead,
);

router.delete(
  "/:id",
  verifyToken,
  authorize("CUSTOMER", "RESTAURANT_OWNER", "DRIVER", "ADMIN"),
  paramsValidation(["id"]),
  deleteNotification,
);

module.exports = router;
