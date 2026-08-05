const express = require("express");
const router = express.Router();

const {
  getMyProfile,
  updateMyProfile,
  changeStatus,
  getAllDrivers,
  getDriverById,
  updateDriver,
  deleteDriver,
} = require("../controllers/driver.controller");

const {
  updateMyProfileValidation,
  updateDriverValidation,
  changeDriverStatusValidation,
} = require("../../middlewares/driver-validation");

const verifyToken = require("../../middlewares/verifyToken");
const authorize = require("../../middlewares/authorize");
const paramsValidation = require("../../middlewares/paramsValidation");

router.get("/me", verifyToken, authorize("DRIVER"), getMyProfile);

router.patch(
  "/me",
  verifyToken,
  authorize("DRIVER"),
  updateMyProfileValidation,
  updateMyProfile,
);

router.patch(
  "/me/status",
  verifyToken,
  authorize("DRIVER"),
  changeDriverStatusValidation,
  changeStatus,
);

router.get("/", verifyToken, authorize("ADMIN"), getAllDrivers);

router.get(
  "/:id",
  verifyToken,
  authorize("ADMIN"),
  paramsValidation(["id"]),
  getDriverById,
);

router.patch(
  "/:id",
  verifyToken,
  authorize("ADMIN"),
  paramsValidation(["id"]),
  updateDriverValidation,
  updateDriver,
);

router.delete(
  "/:id",
  verifyToken,
  authorize("ADMIN"),
  paramsValidation(["id"]),
  deleteDriver,
);

module.exports = router;
