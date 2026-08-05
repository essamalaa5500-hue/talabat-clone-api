const express = require("express");
const router = express.Router();

const {
  createProduct,
  getRestaurantProducts,
  getProductById,
  updateProduct,
  updateProductStatus,
  deleteProduct,
} = require("../controllers/product.controller");

const {
  createProductValidation,
  updateProductValidation,
  updateProductStatusValidation,
} = require("../../middlewares/product-validation");

const verifyToken = require("../../middlewares/verifyToken");
const authorize = require("../../middlewares/authorize");
const paramsValidation = require("../../middlewares/paramsValidation");

router.get(
  "/restaurant/:restaurantId",
  paramsValidation(["restaurantId"]),
  getRestaurantProducts,
);

router.get(
  "/restaurant/:restaurantId/:id",
  paramsValidation(["restaurantId", "id"]),
  getProductById,
);

router.post(
  "/",
  verifyToken,
  authorize("RESTAURANT_OWNER"),
  createProductValidation,
  createProduct,
);

router.patch(
  "/:id",
  verifyToken,
  authorize("RESTAURANT_OWNER"),
  paramsValidation(["id"]),
  updateProductValidation,
  updateProduct,
);

router.patch(
  "/:id/status",
  verifyToken,
  authorize("RESTAURANT_OWNER"),
  paramsValidation(["id"]),
  updateProductStatusValidation,
  updateProductStatus,
);

router.delete(
  "/:id",
  verifyToken,
  authorize("RESTAURANT_OWNER"),
  paramsValidation(["id"]),
  deleteProduct,
);

module.exports = router;
