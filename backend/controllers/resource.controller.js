/**
 * MEMBER 4: Resources, Quizzes & Feedback
 * RESOURCE CONTROLLER
 * This file manages educational materials (Videos, Audio, PDFs). 
 * It includes an approval workflow where counselor uploads must be verified by admins.
 */
import Resource from "../models/Resource.js";
import Notification from "../models/Notification.js";
import { User } from "../models/User.js";

/**
 * UPLOAD RESOURCE
 * Handles file uploads and sets status:
 * - Admin uploads are "approved" instantly.
 * - Counselor uploads are "pending" until reviewed.
 */
export const uploadResource = async (req, res) => {
  try {
    const { title, description, type } = req.body;

    if (!title || !description || !type) {
      return res.status(400).json({
        message: "Title, description and type are required",
      });
    }

    if (!req.file) {
      return res.status(400).json({ message: "File is required" });
    }

    let folderName = "";

    if (type === "VIDEO") folderName = "videos";
    else if (type === "AUDIO") folderName = "audios";
    else if (type === "BOOK") folderName = "books";
    else if (type === "IMAGE") folderName = "images";
    else {
      return res.status(400).json({ message: "Invalid resource type" });
    }

    const fileUrl = `/uploads/${folderName}/${req.file.filename}`;

    // Determine status based on user role
    const isAdmin = req.user.role === "admin";
    const status = isAdmin ? "approved" : "pending";
    console.log(`📦 Resource upload by ${req.user.role} (${req.user._id}): status=${status}`);

    const resource = await Resource.create({
      title,
      description,
      type,
      fileUrl,
      uploadedBy: req.user._id,
      status,
    });

    // If counselor submitted, notify all admins
    if (!isAdmin) {
      const admins = await User.find({ role: "admin" }).select("_id");
      const adminNotifications = admins.map((admin) => ({
        recipientId: admin._id.toString(),
        type: "resource_pending",
        message: `New resource waiting for approval: "${title}"`,
        resourceId: resource._id,
      }));

      if (adminNotifications.length > 0) {
        await Notification.insertMany(adminNotifications);
      }
    }

    return res.status(201).json({
      message: isAdmin
        ? "Resource published successfully!"
        : "Resource submitted for approval!",
      resource,
    });
  } catch (err) {
    console.error("Upload error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

/**
 * GET APPROVED RESOURCES
 * Public endpoint for students to browse validated educational content.
 */
export const getResources = async (req, res) => {
  try {
    const { type, search } = req.query;

    // Show resources that are explicitly approved OR have no status field (legacy data)
    let filter = {
      $or: [
        { status: "approved" },
        { status: { $exists: false } }
      ]
    };

    if (type && type !== "ALL") {
      filter.type = type.toUpperCase();
    }

    if (search) {
      filter.title = { $regex: search, $options: "i" };
    }

    const resources = await Resource.find(filter)
      .populate("uploadedBy", "firstName lastName")
      .sort({ createdAt: -1 });

    return res.json(resources);
  } catch (err) {
    console.error("Get resources error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// ✅ GET PENDING RESOURCES (admin only)
export const getPendingResources = async (req, res) => {
  try {
    const resources = await Resource.find({ status: "pending" })
      .populate("uploadedBy", "firstName lastName email")
      .sort({ createdAt: -1 });

    return res.json(resources);
  } catch (err) {
    console.error("Get pending resources error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// ✅ GET COUNSELOR'S OWN RESOURCES
export const getCounselorResources = async (req, res) => {
  try {
    const resources = await Resource.find({ uploadedBy: req.user._id })
      .sort({ createdAt: -1 });

    return res.json(resources);
  } catch (err) {
    console.error("Get counselor resources error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

/**
 * APPROVE RESOURCE (Admin Only)
 * Transitions a resource from "pending" to "approved" and notifies students.
 */
export const approveResource = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);

    if (!resource) {
      return res.status(404).json({ message: "Resource not found" });
    }

    if (resource.status !== "pending") {
      return res.status(400).json({ message: "Resource is not pending approval" });
    }

    resource.status = "approved";
    resource.reviewedBy = req.user._id;
    resource.reviewedAt = new Date();
    await resource.save();

    // Notify all students that new resources are available
    const students = await User.find({ role: "student" }).select("_id");
    const studentNotifications = students.map((student) => ({
      recipientId: student._id.toString(),
      type: "resource_approved",
      message: `New resources added to the site, feel free to use!`,
      resourceId: resource._id,
    }));

    if (studentNotifications.length > 0) {
      await Notification.insertMany(studentNotifications);
    }

    return res.json({ message: "Resource approved and published!", resource });
  } catch (err) {
    console.error("Approve resource error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// ✅ REJECT RESOURCE (admin only)
export const rejectResource = async (req, res) => {
  try {
    const { reason } = req.body;

    const resource = await Resource.findById(req.params.id);

    if (!resource) {
      return res.status(404).json({ message: "Resource not found" });
    }

    if (resource.status !== "pending") {
      return res.status(400).json({ message: "Resource is not pending approval" });
    }

    resource.status = "rejected";
    resource.reviewedBy = req.user._id;
    resource.reviewedAt = new Date();
    resource.rejectionReason = reason || "No reason provided";
    await resource.save();

    // Notify the counselor who submitted it
    await Notification.create({
      recipientId: resource.uploadedBy.toString(),
      type: "resource_rejected",
      message: `Your resource "${resource.title}" was not approved. Reason: ${resource.rejectionReason}`,
      resourceId: resource._id,
    });

    return res.json({ message: "Resource rejected.", resource });
  } catch (err) {
    console.error("Reject resource error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// ✅ DELETE RESOURCE
export const deleteResource = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);

    if (!resource) {
      return res.status(404).json({ message: "Resource not found" });
    }

    // Counselors can only delete their own pending resources
    if (req.user.role === "counselor") {
      if (resource.uploadedBy.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: "You can only delete your own resources" });
      }
      if (resource.status !== "pending") {
        return res.status(400).json({ message: "You can only delete pending resources" });
      }
    }

    await Resource.findByIdAndDelete(req.params.id);

    return res.json({ message: "Resource deleted successfully" });
  } catch (err) {
    console.error("Delete resource error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

/**
 * DATA MAINTENANCE: FIX COUNSELOR STATUS
 * A special utility endpoint to revert resources that bypassed approval
 * due to previous logic errors.
 */
export const fixCounselorResourceStatus = async (req, res) => {
  try {
    // Find all users with role "counselor"
    const counselors = await User.find({ role: "counselor" }).select("_id");
    const counselorIds = counselors.map(c => c._id);

    // Find resources uploaded by counselors that are incorrectly "approved"
    const result = await Resource.updateMany(
      {
        uploadedBy: { $in: counselorIds },
        status: "approved",
        reviewedBy: { $exists: false } // Only fix those that were NOT explicitly reviewed by admin
      },
      { $set: { status: "pending" } }
    );

    console.log(`🔧 Fixed ${result.modifiedCount} counselor resources from 'approved' to 'pending'`);
    return res.json({
      message: `Fixed ${result.modifiedCount} resource(s). They are now pending approval.`,
      modifiedCount: result.modifiedCount,
    });
  } catch (err) {
    console.error("Fix counselor resources error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};