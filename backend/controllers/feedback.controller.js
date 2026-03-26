const Feedback = require("../models/Feedback");
const { getBookingById } = require("../services/bookingService");

exports.checkEligibility = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { userId, role } = req.user;

    if (role !== "STUDENT") {
      return res.status(403).json({ message: "Only students can submit feedback" });
    }

    const booking = await getBookingById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (booking.studentId !== userId) {
      return res.status(403).json({ message: "Not your booking" });
    }

    if (booking.status !== "COMPLETED") {
      return res.status(400).json({ message: "Session not completed yet" });
    }

    const existing = await Feedback.findOne({ bookingId });
    if (existing) {
      return res.status(409).json({ message: "Feedback already submitted" });
    }

    return res.status(200).json({
      eligible: true,
      counselorId: booking.counselorId,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.createFeedback = async (req, res) => {
  try {
    const { userId, role } = req.user;

    if (role !== "STUDENT") {
      return res.status(403).json({ message: "Only students can submit feedback" });
    }

    const { bookingId, rating, comment, isAnonymous, survey } = req.body;

    const booking = await getBookingById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (booking.studentId !== userId) {
      return res.status(403).json({ message: "Not your booking" });
    }

    if (booking.status !== "COMPLETED") {
      return res.status(400).json({ message: "Session not completed yet" });
    }

    const existing = await Feedback.findOne({ bookingId });
    if (existing) {
      return res.status(409).json({ message: "Feedback already submitted" });
    }

    const saved = await Feedback.create({
      bookingId,
      studentId: userId,
      counselorId: booking.counselorId,
      rating,
      comment,
      isAnonymous,
      survey,
    });

    return res.status(201).json({
      message: "Feedback submitted successfully",
      feedback: saved,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.getFeedbackByCounselor = async (req, res) => {
  try {
    const { counselorId } = req.params;

    const feedbackList = await Feedback.find({ counselorId }).sort({ createdAt: -1 });

    return res.status(200).json({
      counselorId,
      totalFeedbacks: feedbackList.length,
      feedbacks: feedbackList,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.getAverageRating = async (req, res) => {
  try {
    const { counselorId } = req.params;

    const result = await Feedback.aggregate([
      { $match: { counselorId } },
      {
        $group: {
          _id: "$counselorId",
          averageRating: { $avg: "$rating" },
          totalReviews: { $sum: 1 },
        },
      },
    ]);

    if (result.length === 0) {
      return res.status(200).json({
        counselorId,
        averageRating: 0,
        totalReviews: 0,
      });
    }

    return res.status(200).json({
      counselorId,
      averageRating: Number(result[0].averageRating.toFixed(1)),
      totalReviews: result[0].totalReviews,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.updateFeedback = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, role } = req.user;
    if (role !== "STUDENT") return res.status(403).json({ message: "Only students can update feedback" });

    const feedback = await Feedback.findById(id);
    if (!feedback) return res.status(404).json({ message: "Feedback not found" });
    if (feedback.studentId !== userId) return res.status(403).json({ message: "Not your feedback" });

    const { rating, comment, isAnonymous, survey } = req.body;
    feedback.rating = rating || feedback.rating;
    feedback.comment = comment !== undefined ? comment : feedback.comment;
    feedback.isAnonymous = isAnonymous !== undefined ? isAnonymous : feedback.isAnonymous;
    if (survey) feedback.survey = survey;

    await feedback.save();
    return res.status(200).json({ message: "Feedback updated successfully", feedback });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.deleteFeedback = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, role } = req.user;
    if (role !== "STUDENT") return res.status(403).json({ message: "Only students can delete feedback" });

    const feedback = await Feedback.findById(id);
    if (!feedback) return res.status(404).json({ message: "Feedback not found" });
    if (feedback.studentId !== userId) return res.status(403).json({ message: "Not your feedback" });

    await feedback.deleteOne();
    return res.status(200).json({ message: "Feedback deleted successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};