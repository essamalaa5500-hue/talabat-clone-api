const express = require("express");
const router = express.Router();

const {
  createDriverReview,
  updateDriverReview,
  deleteDriverReview,
  getDriverReviewById,
  getDriverReviews,
  getMyReviews,
} = require("../controllers/driver.review.controller");

const {
  createDriverReviewValidation,
  updateDriverReviewValidation,
} = require("../../middlewares/driver-review-validation");

const verifyToken = require("../../middlewares/verifyToken");
const authorize = require("../../middlewares/authorize");
const paramsValidation = require("../../middlewares/paramsValidation");

router.post(
  "/:orderId",
  verifyToken,
  authorize("CUSTOMER"),
  createDriverReview,
);

router.patch(
  "/:orderId",
  verifyToken,
  authorize("CUSTOMER"),
  updateDriverReview,
);

router.delete(
  "/:orderId",
  verifyToken,
  authorize("CUSTOMER"),
  deleteDriverReview,
);

router.get(
  "/order/:orderId",
  verifyToken,
  authorize("DRIVER"),
  paramsValidation(["orderId"]),
  getDriverReviewById,
);

router.get(
  "/driver/:driverId",
  verifyToken,
  authorize("DRIVER"),
  paramsValidation(["driverId"]),
  getDriverReviews,
);

router.get("/my-reviews", verifyToken, authorize("DRIVER"), getMyReviews);

module.exports = router;
