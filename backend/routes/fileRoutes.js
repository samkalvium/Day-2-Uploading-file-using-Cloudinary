const express = require("express");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const router = express.Router();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

// Configure Multer
const storage = multer.memoryStorage(); // ❌ Temporary storage (should be fixed)
const upload = multer({ storage });

// File Upload API
router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const result = await cloudinary.uploader.upload(req.file.buffer); // ❌ Wrong method (students should fix)

    res.json({ url: result.secure_url });
  } catch (error) {
    res.status(500).json({ error: "Upload failed" });
  }
});

module.exports = router;
