const router = require("express").Router();
const fakeAuth = require("../middleware/fakeAuth");
const feedbackController = require("../controllers/feedback.controller");

router.get(
  "/eligibility/:bookingId",
  fakeAuth("STUDENT"),
  feedbackController.checkEligibility
);

router.post(
  "/",
  fakeAuth("STUDENT"),
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

module.exports = router;