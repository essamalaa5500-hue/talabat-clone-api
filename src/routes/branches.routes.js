const express = require("express");
const router = express.Router();

const {
  getAllBranches,
  getBranchesAdmin,
  getMyBranches,
  getBranchById,
  getMyBranchById,
  getBranchByIdAdmin,
  createBranch,
  updateBranch,
  updateBranchStatus,
  deleteBranch,
} = require("../controllers/branches.controller");

const {
  createBranchValidation,
  updateBranchValidation,
  updateBranchStatusValidation,
} = require("../../middlewares/branches-validation");

const verifyToken = require("../../middlewares/verifyToken");
const authorize = require("../../middlewares/authorize");
const paramsValidation = require("../../middlewares/paramsValidation");

router.get("/", getAllBranches);

router.get("/my", verifyToken, authorize("RESTAURANT_OWNER"), getMyBranches);

router.get(
  "/my/:id",
  verifyToken,
  authorize("RESTAURANT_OWNER"),
  paramsValidation(["id"]),
  getMyBranchById,
);

router.post(
  "/",
  verifyToken,
  authorize("RESTAURANT_OWNER"),
  createBranchValidation,
  createBranch,
);

router.patch(
  "/:id",
  verifyToken,
  authorize("RESTAURANT_OWNER"),
  paramsValidation(["id"]),
  updateBranchValidation,
  updateBranch,
);

router.get("/admin", verifyToken, authorize("ADMIN"), getBranchesAdmin);

router.get(
  "/admin/:id",
  verifyToken,
  authorize("ADMIN"),
  paramsValidation(["id"]),
  getBranchByIdAdmin,
);

router.patch(
  "/:id/status",
  verifyToken,
  authorize("ADMIN"),
  paramsValidation(["id"]),
  updateBranchStatusValidation,
  updateBranchStatus,
);

router.delete(
  "/:id",
  verifyToken,
  authorize("ADMIN"),
  paramsValidation(["id"]),
  deleteBranch,
);

router.get("/:id", paramsValidation(["id"]), getBranchById);

module.exports = router;
