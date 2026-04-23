import express from "express";
import upload from "../middleware/uploadResource.js";
import { authenticate, authorize } from "../middleware/auth.js";
import * as resourceController from "../controllers/resource.controller.js";

const router = express.Router();

// ✅ Upload resource (ADMIN = auto-approved, COUNSELOR = pending)
router.post(
  "/",
  authenticate,
  authorize("admin", "counselor"),
  upload.single("file"),
  resourceController.uploadResource
);

// ✅ Get APPROVED resources (public/student view — search + filter)
router.get("/", resourceController.getResources);

// ✅ Get PENDING resources (admin only)
router.get(
  "/pending",
  authenticate,
  authorize("admin"),
  resourceController.getPendingResources
);

// ✅ Get MY resources (counselor's own uploads)
router.get(
  "/my",
  authenticate,
  authorize("counselor"),
  resourceController.getCounselorResources
);

// ✅ Fix counselor resources that were incorrectly approved (admin only)
router.patch(
  "/fix-status",
  authenticate,
  authorize("admin"),
  resourceController.fixCounselorResourceStatus
);

// ✅ Approve resource (admin only)
router.patch(
  "/:id/approve",
  authenticate,
  authorize("admin"),
  resourceController.approveResource
);

// ✅ Reject resource (admin only)
router.patch(
  "/:id/reject",
  authenticate,
  authorize("admin"),
  resourceController.rejectResource
);

// ✅ Delete resource (admin or counselor's own pending)
router.delete(
  "/:id",
  authenticate,
  authorize("admin", "counselor"),
  resourceController.deleteResource
);

export default router;