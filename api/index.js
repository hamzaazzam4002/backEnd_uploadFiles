const express = require("express");
const router = express.Router();

// Define your routes here
router.get("/", (req, res) => {
  res.send("Welcome to the API!");
});

router.get("/health", (req, res) => {
  res.status(200).json({ status: "UP" });
});

// Example of a protected route (e.g., JWT authentication can be added here)
router.get("/protected", (req, res) => {
  // Authentication middleware can be added here
  res.status(200).json({ message: "This is a protected route" });
});

// Other routes can be added here

const app = express();
app.use(express.json());
app.use(router);

module.exports = { app };
