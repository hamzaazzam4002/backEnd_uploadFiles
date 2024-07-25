const express = require("express");
const router = express.Router();

// تعريف المسارات الخاصة بك هنا
router.get("/", (req, res) => {
  res.send("Welcome to the API!");
});

router.get("/health", (req, res) => {
  res.status(200).json({ status: "UP" });
});

// مثال على مسار محمي (يمكن إضافة مصادقة JWT هنا)
router.get("/protected", (req, res) => {
  // يمكن إضافة middleware الخاص بالمصادقة هنا
  res.status(200).json({ message: "This is a protected route" });
});

// يمكن إضافة مسارات أخرى هنا

module.exports = router;
