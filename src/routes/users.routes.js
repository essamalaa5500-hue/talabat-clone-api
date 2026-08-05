const express = require("express");
const router = express.Router();

const {
  getAllUsers,
  getMyProfile,
  getUserById,
  updateMyProfile,
  deleteMyAccount,
  updateUser,
} = require("../controllers/users.controller");

const {
  getAllUsersValidation,
  updateProfileValidation,
  updateUserValidation,
} = require("../../middlewares/users-validation");

const authorize = require("../../middlewares/authorize");
const verifyToken = require("../../middlewares/verifyToken");
const paramsValidation = require("../../middlewares/paramsValidation");

router.get("/me", verifyToken, getMyProfile);
router.patch("/me", verifyToken, updateProfileValidation, updateMyProfile);
router.delete("/me", verifyToken, deleteMyAccount);

router.get(
  "/",
  verifyToken,
  authorize("ADMIN"),
  getAllUsersValidation,
  getAllUsers,
);

router.get(
  "/:id",
  verifyToken,
  authorize("ADMIN"),
  paramsValidation(["id"]),
  getUserById,
);

router.patch(
  "/:id",
  verifyToken,
  authorize("ADMIN"),
  paramsValidation(["id"]),
  updateUserValidation,
  updateUser,
);

module.exports = router;
