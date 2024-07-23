const multer = require("multer");
const uuidv4 = require("uuid").v4;
const path = require("path");
const cors = require("cors");
const express = require("express");
const { v2: cloudinary } = require("cloudinary");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const dotenv = require("dotenv").config();

const api = require("./api");

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

const app = express();

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
      let folderName = "uploads";
      let format = file.mimetype.split("/")[1]; // Get the file extension from the MIME type
  
      // Adjust the folder name and format for specific file types
      if (file.mimetype.startsWith("image")) {
        folderName = "images";
      } else if (file.mimetype.startsWith("video")) {
        folderName = "videos";
      } else if (file.mimetype === "application/pdf") {
        folderName = "pdfs";
        format = "pdf"; // Ensure the format is set to "pdf" for PDFs
      }
  
      return {
        folder: folderName,
        format: format,
        public_id: `category-${file.originalname.split(".")[0]}-${Date.now()}`,
      };
    },
  });

function multerFilter(req, file, cb) {
    const fileType = file.mimetype.split("/")[0];
    if (
        fileType.startsWith("image") ||
        fileType.startsWith("video") ||
        file.mimetype === "application/pdf"
    ) {
        cb(null, true);
    } else {
        req.fileValidationError = "Only Images, Videos, and PDFs are allowed!";
        cb(null, false);
    }
}

const upload = multer({ storage: storage });

const corsOptions = {
    origin: '*', // Allow only this origin
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Allow these methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Allow these headers
    credentials: true, // Allow credentials
  };

app.use(cors(corsOptions)); // Add CORS middleware
app.use(express.json());
app.use(express.static(path.join(__dirname,"..","public")));

app.post("/upload", upload.single("file"), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: "Please upload a file" });
      }
      res.status(200).json({
        message: req.file.path,
      });
});

app.use("/api/v1", api.app);

// app.listen(process.env.PORT, () => console.log(`Server is running on port ${process.env.PORT}`));

module.exports = {app};
