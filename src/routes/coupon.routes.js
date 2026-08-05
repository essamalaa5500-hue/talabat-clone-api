const express = require("express");

const router = express.Router();

const verifyToken = require("../../middlewares/verifyToken");
const authorize = require("../../middlewares/authorize");

const {
  createCouponValidation,
  updateCouponValidation,
  couponIdValidation,
} = require("../../middlewares/coupon-validation");

const {
  createCoupon,
  getAllCoupons,
  getCouponById,
  updateCoupon,
  deleteCoupon,
} = require("../controllers/coupon.controller");

router.post(
  "/",
  verifyToken,
  authorize("ADMIN"),
  createCouponValidation,
  createCoupon,
);

router.get("/", verifyToken, authorize("ADMIN"), getAllCoupons);

router.get(
  "/:id",
  verifyToken,
  authorize("ADMIN"),
  couponIdValidation,
  getCouponById,
);

router.patch(
  "/:id",
  verifyToken,
  authorize("ADMIN"),
  couponIdValidation,
  updateCouponValidation,
  updateCoupon,
);

router.delete(
  "/:id",
  verifyToken,
  authorize("ADMIN"),
  couponIdValidation,
  deleteCoupon,
);

module.exports = router;
