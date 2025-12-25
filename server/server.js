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

// ✅ CORS Configuration (Local + Netlify + GitHub Pages)
app.use(
    cors({
        origin: [
            "http://localhost:5500",
            "https://internship-task-tracker.netlify.app",
            "https://ashokkaji26.github.io"
        ],
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type"],
        credentials: true
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

// Health check route
app.get("/", (req, res) => {
    res.send("Internship Task Tracker Backend is running 🚀");
});

/* =======================
   GLOBAL ERROR HANDLER
======================= */
app.use((err, req, res, next) => {
    console.error("Server Error:", err.stack);
    res.status(500).json({
        success: false,
        message: "Internal Server Error"
    });
});

/* =======================
   DATABASE CONNECTION
======================= */

// Connect MongoDB before starting server
connectDB();

/* =======================
   SERVER START
======================= */

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
});