const express = require("express");
const router = express.Router();

const {
  addToCart,
  getCart,
  updateQuantity,
  deleteCartItem,
  clearCart,
} = require("../controllers/cart.controller");

const verifyToken = require("../../middlewares/verifyToken");
const authorize = require("../../middlewares/authorize");
const paramsValidation = require("../../middlewares/paramsValidation");

const {
  addToCartValidation,
  updateQuantityValidation,
} = require("../../middlewares/cart-validation");

router.post("/", verifyToken, addToCartValidation, addToCart);

router.get("/", verifyToken, authorize("CUSTOMER"), getCart);

router.patch(
  "/item/:itemId",
  verifyToken,
  authorize("CUSTOMER"),
  paramsValidation(["itemId"]),
  updateQuantityValidation,
  updateQuantity,
);

router.delete(
  "/item/:itemId",
  verifyToken,
  authorize("CUSTOMER"),
  paramsValidation(["itemId"]),
  deleteCartItem,
);

router.delete("/", verifyToken, authorize("CUSTOMER"), clearCart);

module.exports = router;
