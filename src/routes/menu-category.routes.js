const express = require("express");
const router = express.Router();

const {
  getAllMenuCategories,
  getMyMenuCategoryById,
  getAllMyMenuCategories,
  createMenuCategory,
  updateMenuCategory,
  deleteMenuCategory,
} = require("../controllers/menuCategory.controller");

const {
  createMenuCategoryValidation,
  updateMenuCategoryValidation,
} = require("../../middlewares/menu-category-validation");

const verifyToken = require("../../middlewares/verifyToken");
const authorize = require("../../middlewares/authorize");
const paramsValidation = require("../../middlewares/paramsValidation");

router.get("/", getAllMenuCategories);

router.get(
  "/my",
  verifyToken,
  authorize("RESTAURANT_OWNER"),
  getAllMyMenuCategories,
);

router.get(
  "/my/:id",
  verifyToken,
  authorize("RESTAURANT_OWNER"),
  paramsValidation(["id"]),
  getMyMenuCategoryById,
);

router.post(
  "/",
  verifyToken,
  authorize("RESTAURANT_OWNER"),
  createMenuCategoryValidation,
  createMenuCategory,
);

router.patch(
  "/:id",
  verifyToken,
  authorize("RESTAURANT_OWNER"),
  paramsValidation(["id"]),
  updateMenuCategoryValidation,
  updateMenuCategory,
);

router.delete(
  "/:id",
  verifyToken,
  authorize("RESTAURANT_OWNER"),
  paramsValidation(["id"]),
  deleteMenuCategory,
);

router.get("/:id", paramsValidation(["id"]), getAllMenuCategories);

module.exports = router;
