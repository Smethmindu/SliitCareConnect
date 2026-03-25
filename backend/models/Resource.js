const mongoose = require("mongoose");

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

    uploadedBy: { type: String, required: true }, // ADMIN ID

  },
  { timestamps: true }
);

module.exports = mongoose.model("Resource", ResourceSchema);