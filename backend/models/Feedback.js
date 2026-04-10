import mongoose from "mongoose";

const SurveySchema = new mongoose.Schema(
  {
    feltHeard: { type: Number, min: 1, max: 5, required: true },
    sessionHelpful: { type: Number, min: 1, max: 5, required: true },
    clarity: { type: Number, min: 1, max: 5, required: true },
    comfort: { type: Number, min: 1, max: 5, required: true },
    wouldRecommend: { type: String, enum: ["YES", "NO"], required: true },
  },
  { _id: false }
);

const FeedbackSchema = new mongoose.Schema(
  {
    bookingId: { type: String, required: false },
    studentId: { type: String, required: true },
    counselorId: { type: String, required: true },

    rating: { type: Number, min: 1, max: 5, required: true },
    tags: [{ type: String }],
    comment: { type: String, maxlength: 500, required: false },
    isAnonymous: { type: Boolean, default: true },

    survey: { type: SurveySchema, required: false },
  },
  { timestamps: true }
);

export default mongoose.model("Feedback", FeedbackSchema);