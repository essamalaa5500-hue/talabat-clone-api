const express = require("express");
const router = express.Router();

const {
  getAllRestaurants,
  getAllRestaurantAdmin,
  getRestaurantById,
  getRestaurantByIdAdmin,
  createRestaurant,
  updateRestaurant,
  updateRestaurantStatus,
  deleteRestaurant,
  getMyRestaurants,
} = require("../controllers/restaurant.controller");

const {
  createRestaurantValidation,
  updateRestaurantValidation,
  updateRestaurantStatusValidation,
  deleteRestaurantValidation,
} = require("../../middlewares/restaurant-validation");

const verifyToken = require("../../middlewares/verifyToken");
const authorize = require("../../middlewares/authorize");
const paramsValidation = require("../../middlewares/paramsValidation");

router.get("/", getAllRestaurants);

router.get("/admin", verifyToken, authorize("ADMIN"), getAllRestaurantAdmin);

router.get("/my", verifyToken, authorize("RESTAURANT_OWNER"), getMyRestaurants);

router.get(
  "/admin/:id",
  verifyToken,
  authorize("ADMIN"),
  paramsValidation(["id"]),
  getRestaurantByIdAdmin,
);

router.post(
  "/",
  verifyToken,
  authorize("RESTAURANT_OWNER"),
  createRestaurantValidation,
  createRestaurant,
);

router.patch(
  "/:id/status",
  verifyToken,
  authorize("ADMIN"),
  paramsValidation(["id"]),
  updateRestaurantStatusValidation,
  updateRestaurantStatus,
);

router.patch(
  "/:id",
  verifyToken,
  authorize("RESTAURANT_OWNER"),
  paramsValidation(["id"]),
  updateRestaurantValidation,
  updateRestaurant,
);

router.delete(
  "/:id",
  verifyToken,
  authorize("ADMIN"),
  paramsValidation(["id"]),
  deleteRestaurant,
);

router.get("/:id", paramsValidation(["id"]), getRestaurantById);

module.exports = router;
