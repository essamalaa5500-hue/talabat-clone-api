const express = require("express");
const router = express.Router();

const {
  createRestaurantReview,
  updateRestaurantReview,
  deleteRestaurantReview,
  getRestaurantReviewById,
  getRestaurantReviews,
  getMyReviews,
} = require("../controllers/Restaurant.Review.controller");

const {
  createRestaurantReviewValidation,
  updateRestaurantReviewValidation,
} = require("../../middlewares/restaurant-review-validation");

const verifyToken = require("../../middlewares/verifyToken");
const authorize = require("../../middlewares/authorize");
const paramsValidation = require("../../middlewares/paramsValidation");

router.get("/my-reviews", verifyToken, authorize("CUSTOMER"), getMyReviews);

router.get(
  "/order/:orderId",
  verifyToken,
  authorize("RESTAURANT_OWNER"),
  paramsValidation(["orderId"]),
  getRestaurantReviewById,
);

router.get(
  "/restaurant/:restaurantId",
  verifyToken,
  authorize("RESTAURANT_OWNER", "CUSTOMER"),
  paramsValidation(["restaurantId"]),
  getRestaurantReviews,
);

router.post(
  "/:orderId",
  verifyToken,
  authorize("CUSTOMER"),
  paramsValidation(["orderId"]),
  createRestaurantReviewValidation,
  createRestaurantReview,
);

router.patch(
  "/:orderId",
  verifyToken,
  authorize("CUSTOMER"),
  paramsValidation(["orderId"]),
  updateRestaurantReviewValidation,
  updateRestaurantReview,
);

router.delete(
  "/:orderId",
  verifyToken,
  authorize("CUSTOMER"),
  paramsValidation(["orderId"]),
  deleteRestaurantReview,
);

module.exports = router;
