const express = require("express");
const router = express.Router();

const {
  uploadImage,
  getProductImages,
  deleteProductImage,
  setMainImage,
} = require("../controllers/product.image.controller");

const upload = require("../../middlewares/upload");
const verifyToken = require("../../middlewares/verifyToken");
const authorize = require("../../middlewares/authorize");
const paramsValidation = require("../../middlewares/paramsValidation");

router.post(
  "/product/:id",
  verifyToken,
  authorize("RESTAURANT_OWNER"),
  paramsValidation(["id"]),
  upload.single("image"),
  uploadImage,
);

router.get(
  "/product/:id",
  verifyToken,
  authorize("RESTAURANT_OWNER"),
  paramsValidation(["id"]),
  getProductImages,
);

router.delete(
  "/:id",
  verifyToken,
  authorize("RESTAURANT_OWNER"),
  paramsValidation(["id"]),
  deleteProductImage,
);

router.patch(
  "/:id/main",
  verifyToken,
  authorize("RESTAURANT_OWNER"),
  paramsValidation(["id"]),
  setMainImage,
);

module.exports = router;
