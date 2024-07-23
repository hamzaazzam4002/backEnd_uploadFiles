const express = require("express");
const multer = require("multer");
const uuidv4 = require("uuid").v4;
const path = require("path");
const cors = require("cors");
const dotenv = require("dotenv").config();

 

const app = express();

const multerStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./uploads");
    },
    filename: function (req, file, cb) {
        const ext = file.mimetype.split("/")[1];
        cb(
            null,
            `category-${uuidv4().split("-").join("")}-${Date.now()}.${ext}`
        );
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

const upload = multer({ storage: multerStorage, fileFilter: multerFilter });

const corsOptions = {
    origin: '*', // Allow only this origin
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Allow these methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Allow these headers
    credentials: true, // Allow credentials
  };

app.use(cors(corsOptions)); // Add CORS middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, "uploads")));

app.post("/upload", upload.single("file"), (req, res) => {
    if (req.fileValidationError) {
        return res.status(400).json({ message: req.fileValidationError });
    }
    if (!req.file) {
        return res.status(400).json({ message: "Please upload a file" });
    }
    res.status(200).json({
        // message: `http://localhost:3000/${req.file.filename}`,
        message: `http://localhost:${process.env.PORT}/${req.file.filename}`,
    });
});

app.listen(process.env.PORT, () => console.log(`Server is running on port ${process.env.PORT}`));
