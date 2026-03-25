const mongoose = require("mongoose");

const BlogPostSchema = new mongoose.Schema(
  {
    authorCounselorId: { type: String, required: true },
    title: { type: String, required: true, trim: true },
    content: { type: String, required: true },
    category: { type: String, default: "General" },
    tags: [{ type: String }],
    status: { type: String, enum: ["DRAFT", "PUBLISHED"], default: "DRAFT" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("BlogPost", BlogPostSchema);