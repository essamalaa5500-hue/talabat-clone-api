const express = require("express");
const router = express.Router();

const {
  createProductOptionValue,
  getProductOptionValues,
  getProductOptionValue,
  updateProductOptionValue,
  deleteOptionValue,
} = require("../controllers/product.option.value.controller");

const {
  createOptionValueValidation,
  updateOptionValueValidation,
} = require("../../middlewares/product-option-value-validation");

const verifyToken = require("../../middlewares/verifyToken");
const authorize = require("../../middlewares/authorize");
const paramsValidation = require("../../middlewares/paramsValidation");

router.get(
  "/option/:productOptionId",
  verifyToken,
  authorize("RESTAURANT_OWNER"),
  paramsValidation(["productOptionId"]),
  getProductOptionValues,
);

router.get(
  "/option/:productOptionId/:valueId",
  verifyToken,
  authorize("RESTAURANT_OWNER"),
  paramsValidation(["productOptionId", "valueId"]),
  getProductOptionValue,
);

router.post(
  "/option/:productOptionId",
  verifyToken,
  authorize("RESTAURANT_OWNER"),
  paramsValidation(["productOptionId"]),
  createOptionValueValidation,
  createProductOptionValue,
);

router.patch(
  "/option/:productOptionId/:valueId",
  verifyToken,
  authorize("RESTAURANT_OWNER"),
  paramsValidation(["productOptionId", "valueId"]),
  updateOptionValueValidation,
  updateProductOptionValue,
);

router.delete(
  "/option/:productOptionId/:valueId",
  verifyToken,
  authorize("RESTAURANT_OWNER"),
  paramsValidation(["productOptionId", "valueId"]),
  deleteOptionValue,
);

module.exports = router;
