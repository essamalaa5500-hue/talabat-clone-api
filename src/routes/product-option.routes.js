const express = require("express");
const router = express.Router();

const {
  createProductOption,
  getProductOptions,
  getProductOption,
  updateProductOption,
  deleteProductOption,
} = require("../controllers/product.option.controller");

const {
  createProductOptionValidation,
  updateProductOptionValidation,
} = require("../../middlewares/product-option-validation");

const verifyToken = require("../../middlewares/verifyToken");
const authorize = require("../../middlewares/authorize");
const paramsValidation = require("../../middlewares/paramsValidation");

router.get(
  "/product/:productId",
  verifyToken,
  authorize("RESTAURANT_OWNER"),
  paramsValidation(["productId"]),
  getProductOptions,
);

router.get(
  "/product/:productId/:optionId",
  verifyToken,
  authorize("RESTAURANT_OWNER"),
  paramsValidation(["productId", "optionId"]),
  getProductOption,
);

router.post(
  "/product/:productId",
  verifyToken,
  authorize("RESTAURANT_OWNER"),
  paramsValidation(["productId"]),
  createProductOptionValidation,
  createProductOption,
);

router.patch(
  "/product/:productId/:optionId",
  verifyToken,
  authorize("RESTAURANT_OWNER"),
  paramsValidation(["productId", "optionId"]),
  updateProductOptionValidation,
  updateProductOption,
);

router.delete(
  "/product/:productId/:optionId",
  verifyToken,
  authorize("RESTAURANT_OWNER"),
  paramsValidation(["productId", "optionId"]),
  deleteProductOption,
);

module.exports = router;
