const express = require("express");
const router = express.Router();

const {
  createProductVariant,
  getProductVariantsOwner,
  getProductVariants,
  updateProductVariant,
  updateProductVariantStatus,
  deleteProductVariant,
} = require("../controllers/product.variant.controller");

const {
  createProductVariantValidation,
  updateProductVariantValidation,
  updateProductVariantStatusValidation,
} = require("../../middlewares/product-variant-validation");

const verifyToken = require("../../middlewares/verifyToken");
const authorize = require("../../middlewares/authorize");
const paramsValidation = require("../../middlewares/paramsValidation");

router.get(
  "/product/:productId",
  paramsValidation(["productId"]),
  getProductVariants,
);

router.get(
  "/product/:productId",
  verifyToken,
  authorize("RESTAURANT_OWNER"),
  paramsValidation(["productId"]),
  getProductVariantsOwner,
);

router.post(
  "/product/:productId",
  verifyToken,
  authorize("RESTAURANT_OWNER"),
  paramsValidation(["productId"]),
  createProductVariantValidation,
  createProductVariant,
);

router.patch(
  "/:id",
  verifyToken,
  authorize("RESTAURANT_OWNER"),
  paramsValidation(["id"]),
  updateProductVariantValidation,
  updateProductVariant,
);

router.patch(
  "/:id/status",
  verifyToken,
  authorize("RESTAURANT_OWNER"),
  paramsValidation(["id"]),
  updateProductVariantStatusValidation,
  updateProductVariantStatus,
);

router.delete(
  "/:id",
  verifyToken,
  authorize("RESTAURANT_OWNER"),
  paramsValidation(["id"]),
  deleteProductVariant,
);

module.exports = router;
