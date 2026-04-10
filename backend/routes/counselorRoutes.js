import express from "express";
import { authenticate, authorize } from "../middleware/auth.js";
import {
  createCounselor,
  getAllCounselors,
  getCounselorById,
  getCounselorByUserId,
  updateCounselorProfile,
  getAvailability,
  updateAvailability,
  deleteCounselor,
} from "../controllers/counselorController.js";

const router = express.Router();

// Public endpoints
router.get("/", getAllCounselors);
router.get("/user/:userId", getCounselorByUserId);
router.get("/:id", getCounselorById);
router.get("/:id/availability", getAvailability);

// Protected endpoints
router.post("/", authenticate, authorize('admin', 'counselor'), createCounselor);
router.put("/:id/profile", authenticate, authorize('admin', 'counselor'), updateCounselorProfile);
router.put("/:id/availability", authenticate, authorize('admin', 'counselor'), updateAvailability);
router.delete("/:id", authenticate, authorize('admin'), deleteCounselor);

export default router;
