const multer = require("multer");
const path = require("path");
const fs = require("fs");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let type = req.body.type;

    if (!type) return cb(new Error("Type is required"), null);

    type = type.toUpperCase();

    let folder = "uploads/";

    if (type === "VIDEO") folder += "videos";
    else if (type === "AUDIO") folder += "audios";
    else if (type === "BOOK") folder += "books";
    else if (type === "IMAGE") folder += "images";
    else return cb(new Error("Invalid type"), null);

    // ✅ create folder if not exists (VERY IMPORTANT)
    if (!fs.existsSync(folder)) {
      fs.mkdirSync(folder, { recursive: true });
    }

    cb(null, folder);
  },

  filename: function (req, file, cb) {
    const uniqueName = Date.now() + path.extname(file.originalname);
    cb(null, uniqueName);
  },
});

module.exports = multer({ storage });