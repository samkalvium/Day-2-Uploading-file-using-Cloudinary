require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const fileUpload = require("express-fileupload"); 
const cloudinary = require("cloudinary").v2;      
const fileRoutes = require("./routes/fileRoutes");

const app = express();

// Middlewares
app.use(express.json());
app.use(cors());
app.use(fileUpload({ useTempFiles: true })); 

// Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("DB Connection Error:", err));

app.use("/api/files", fileRoutes);

app.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}`));
