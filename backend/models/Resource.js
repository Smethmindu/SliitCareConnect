import mongoose from "mongoose";

const ResourceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },

    type: {
      type: String,
      enum: ["VIDEO", "AUDIO", "BOOK", "IMAGE"],
      required: true,
    },

    fileUrl: { type: String, required: true },

    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "approved",
    },

    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    reviewedAt: { type: Date },

    rejectionReason: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("Resource", ResourceSchema);