const router = require("express").Router();
const upload = require("../middleware/uploadResource");
const resourceController = require("../controllers/resource.controller");

// ✅ Upload resource (ADMIN)
router.post(
  "/",
  upload.single("file"), // file field name = "file"
  resourceController.uploadResource
);

// ✅ Get resources (search + filter)
router.get("/", resourceController.getResources);

module.exports = router;