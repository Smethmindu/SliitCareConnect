/**
 * MEMBER 2: Counselor & Public Pages
 * COUNSELOR CONTROLLER
 * This file handles all data operations related to counselor profiles, specialties, and schedules.
 */
import Counselor from "../models/counselorModel.js";

// Create a new counselor
export const createCounselor = async (req, res) => {
  try {
    const counselor = await Counselor.create(req.body);
    res.status(201).json({
      status: "success",
      data: { counselor },
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};

/**
 * GET ALL COUNSELORS
 * Fetches the list of counselors. Supports filtering by specialty and searching by name.
 */
export const getAllCounselors = async (req, res) => {
  try {
    const { specialty, search } = req.query;
    let filter = {};

    // Filter by specialty
    if (specialty && specialty !== "All") {
      filter.specialities = {
        $elemMatch: { $regex: specialty, $options: "i" },
      };
    }

    // Search by name or speciality
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { speciality: { $regex: search, $options: "i" } },
        { specialities: { $elemMatch: { $regex: search, $options: "i" } } },
      ];
    }

    const counselors = await Counselor.find(filter);

    res.status(200).json({
      status: "success",
      results: counselors.length,
      data: { counselors },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

// Get single counselor by ID
export const getCounselorById = async (req, res) => {
  try {
    const counselor = await Counselor.findById(req.params.id);

    if (!counselor) {
      return res.status(404).json({
        status: "fail",
        message: "No counselor found with that ID.",
      });
    }

    res.status(200).json({
      status: "success",
      data: { counselor },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

// Get counselor by userId (for logged-in counselor to find their own profile)
export const getCounselorByUserId = async (req, res) => {
  try {
    const counselor = await Counselor.findOne({ userId: req.params.userId });

    if (!counselor) {
      return res.status(404).json({
        status: "fail",
        message: "No counselor profile found for this user.",
      });
    }

    res.status(200).json({
      status: "success",
      data: { counselor },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

/**
 * UPDATE COUNSELOR PROFILE
 * Allows counselors to update their biography, education, and credentials.
 */
export const updateCounselorProfile = async (req, res) => {
  try {
    const { name, email, dob, speciality, specialities, bio, education, credentials } = req.body;

    const counselor = await Counselor.findByIdAndUpdate(
      req.params.id,
      { name, email, dob, speciality, specialities, bio, education, credentials },
      { new: true, runValidators: true }
    );

    if (!counselor) {
      return res.status(404).json({
        status: "fail",
        message: "No counselor found with that ID.",
      });
    }

    res.status(200).json({
      status: "success",
      data: { counselor },
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};

// Get counselor availability
export const getAvailability = async (req, res) => {
  try {
    const counselor = await Counselor.findById(req.params.id).select(
      "availability"
    );

    if (!counselor) {
      return res.status(404).json({
        status: "fail",
        message: "No counselor found with that ID.",
      });
    }

    res.status(200).json({
      status: "success",
      data: { availability: counselor.availability },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

/**
 * UPDATE AVAILABILITY
 * Updates the weekly schedule (days and times) when a counselor is free to see students.
 */
export const updateAvailability = async (req, res) => {
  try {
    const counselor = await Counselor.findByIdAndUpdate(
      req.params.id,
      { availability: req.body.availability },
      { new: true, runValidators: true }
    ).select("availability");

    if (!counselor) {
      return res.status(404).json({
        status: "fail",
        message: "No counselor found with that ID.",
      });
    }

    res.status(200).json({
      status: "success",
      data: { availability: counselor.availability },
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};

// Delete a counselor
export const deleteCounselor = async (req, res) => {
  try {
    const counselor = await Counselor.findByIdAndDelete(req.params.id);

    if (!counselor) {
      return res.status(404).json({
        status: "fail",
        message: "No counselor found with that ID.",
      });
    }

    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};
