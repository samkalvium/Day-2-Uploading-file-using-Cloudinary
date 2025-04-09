const express = require("express");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const router = express.Router();
const Upload = require("../models/Upload"); 

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "uploads",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    public_id: (req, file) => Date.now() + "-" + file.originalname,
  },
});

const upload = multer({ storage });

// File Upload Endpoint
router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const result = await cloudinary.uploader.upload_stream(
      { resource_type: "auto" },
      async (error, result) => {
        if (error) return res.status(500).json({ error: "Upload to Cloudinary failed" });

        const newUpload = new Upload({ url: result.secure_url });
        await newUpload.save();

        res.json({ url: result.secure_url });
      }
    );

    const streamifier = require("streamifier");
    streamifier.createReadStream(req.file.buffer).pipe(result);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Upload failed" });
  }
});
module.exports = router;
