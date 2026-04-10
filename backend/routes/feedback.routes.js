import express from "express";
import { authenticate, authorize } from '../middleware/auth.js';
import * as feedbackController from "../controllers/feedback.controller.js";

const router = express.Router();
router.get(
  "/eligibility/:bookingId",
  authenticate,
  authorize("student"),
  feedbackController.checkEligibility
);

router.post(
  "/",
  authenticate,
  authorize("student"),
  feedbackController.createFeedback
);

// View all feedback for a specific counselor
router.get(
  "/counselor/:counselorId",
  feedbackController.getFeedbackByCounselor
);

// Get average rating for a specific counselor
router.get(
  "/counselor/:counselorId/average",
  feedbackController.getAverageRating
);

// Update feedback
router.put(
  "/:id",
  authenticate,
  authorize("student"),
  feedbackController.updateFeedback
);

// Delete feedback
router.delete(
  "/:id",
  authenticate,
  authorize("student"),
  feedbackController.deleteFeedback
);

export default router;