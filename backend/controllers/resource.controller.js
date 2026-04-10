import Resource from "../models/Resource.js";

// ✅ UPLOAD RESOURCE
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

    const resource = await Resource.create({
      title,
      description,
      type,
      fileUrl,
      uploadedBy: "ADMIN001", // temp
    });

    return res.status(201).json(resource);
  } catch (err) {
    console.error("Upload error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// ✅ GET + SEARCH + FILTER
export const getResources = async (req, res) => {
  try {
    const { type, search } = req.query;

    let filter = {};

    if (type && type !== "ALL") {
      filter.type = type.toUpperCase();
    }

    if (search) {
      filter.title = { $regex: search, $options: "i" };
    }

    const resources = await Resource.find(filter).sort({ createdAt: -1 });

    return res.json(resources);
  } catch (err) {
    console.error("Get resources error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};