require("dotenv").config();

const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const taskRoutes = require("./routes/taskRoutes");

const app = express();

/* =======================
   MIDDLEWARE
======================= */

// Enable CORS (allow frontend)
app.use(
    cors({
        origin: "*", // replace with frontend URL in production
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type"]
    })
);

// Parse JSON request body
app.use(express.json());

/* =======================
   ROUTES
======================= */

// User APIs
app.use("/api/users", userRoutes);

// Task APIs
app.use("/api/tasks", taskRoutes);

// Health check
app.get("/", (req, res) => {
    res.send("Internship Task Tracker Backend is running");
});

/* =======================
   GLOBAL ERROR HANDLER
======================= */
app.use((err, req, res, next) => {
    console.error("Server Error:", err.stack);
    res.status(500).json({ message: "Internal Server Error" });
});

/* =======================
   DATABASE CONNECTION
======================= */

// Connect DB before server starts
connectDB();

/* =======================
   SERVER START
======================= */

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});