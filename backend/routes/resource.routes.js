import express from "express";
import upload from "../middleware/uploadResource.js";
import * as resourceController from "../controllers/resource.controller.js";

const router = express.Router();
// ✅ Upload resource (ADMIN)
router.post(
  "/",
  upload.single("file"), // file field name = "file"
  resourceController.uploadResource
);

// ✅ Get resources (search + filter)
router.get("/", resourceController.getResources);

export default router;