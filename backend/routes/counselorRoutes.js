import express from "express";
import {
  createCounselor,
  getAllCounselors,
  getCounselorById,
  updateCounselorProfile,
  getAvailability,
  updateAvailability,
  deleteCounselor,
} from "../controllers/counselorController.js";

const router = express.Router();

// Public endpoints
router.post("/", createCounselor);
router.get("/", getAllCounselors);
router.get("/:id", getCounselorById);
router.get("/:id/availability", getAvailability);

// Protected endpoints (auth middleware to be added by auth team member)
router.put("/:id/profile", updateCounselorProfile);
router.put("/:id/availability", updateAvailability);
router.delete("/:id", deleteCounselor);

export default router;
