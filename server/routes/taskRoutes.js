const express = require("express");
const {
    createTask,
    getTasksByUser,
    updateTask,
    deleteTask
} = require("../controllers/taskController");

const router = express.Router();

/* =========================
   TASK ROUTES
========================= */

// Create a new task
router.post("/", createTask);

// Get all tasks for a specific user
router.get("/:userId", getTasksByUser);

// Update a task (title, status, deadline, etc.)
router.put("/:id", updateTask);

// Delete a task
router.delete("/:id", deleteTask);

module.exports = router;