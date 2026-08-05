const express = require("express");
const router = express.Router();

const {
  getAllCuisines,
  getCuisineById,
  createCuisine,
  updateCuisine,
  deleteCuisine,
} = require("../controllers/cuisines.controller");

const {
  createCuisineValidation,
  updateCuisineValidation,
} = require("../../middlewares/cuisines-validation");

const verifyToken = require("../../middlewares/verifyToken");
const authorize = require("../../middlewares/authorize");
const paramsValidation = require("../../middlewares/paramsValidation");

router.get("/", getAllCuisines);

router.get("/:id", paramsValidation(["id"]), getCuisineById);

router.post(
  "/",
  verifyToken,
  authorize("ADMIN"),
  createCuisineValidation,
  createCuisine,
);

router.patch(
  "/:id",
  verifyToken,
  authorize("ADMIN"),
  paramsValidation(["id"]),
  updateCuisineValidation,
  updateCuisine,
);

router.delete(
  "/:id",
  verifyToken,
  authorize("ADMIN"),
  paramsValidation(["id"]),
  deleteCuisine,
);

module.exports = router;
