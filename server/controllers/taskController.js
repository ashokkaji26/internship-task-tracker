const Task = require("../models/Task");

/* =========================
   CREATE TASK
========================= */
const createTask = async (req, res) => {
    try {
        const {
            title,
            description,
            userId,
            priority,
            dueDate
        } = req.body;

        /* =========================
           VALIDATION
        ========================= */
        if (!title || !userId) {
            return res.status(400).json({
                success: false,
                message: "Title and User ID are required"
            });
        }

        if (priority && !["low", "medium", "high"].includes(priority)) {
            return res.status(400).json({
                success: false,
                message: "Invalid priority value"
            });
        }

        /* =========================
           CREATE TASK (FIXED)
        ========================= */
        const task = await Task.create({
            title,
            description,
            priority: priority || "medium",   // ✅ FIX BUG-2
            dueDate: dueDate || null,         // ✅ FIX BUG-3
            user: userId
        });

        return res.status(201).json({
            success: true,
            message: "Task added successfully",
            task
        });

    } catch (error) {
        console.error("Create Task Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to create task"
        });
    }
};

/* =========================
   GET TASKS BY USER
========================= */
const getTasksByUser = async (req, res) => {
    try {
        const { userId } = req.params;

        const tasks = await Task.find({ user: userId })
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            tasks
        });

    } catch (error) {
        console.error("Fetch Tasks Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch tasks"
        });
    }
};

/* =========================
   UPDATE TASK
========================= */
const updateTask = async (req, res) => {
    try {
        const {
            title,
            description,
            status,
            priority,
            dueDate
        } = req.body;

        /* =========================
           VALIDATIONS
        ========================= */
        if (status && !["pending", "in-progress", "completed"].includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid task status"
            });
        }

        if (priority && !["low", "medium", "high"].includes(priority)) {
            return res.status(400).json({
                success: false,
                message: "Invalid priority value"
            });
        }

        /* =========================
           UPDATE TASK (FIXED)
        ========================= */
        const updatedTask = await Task.findByIdAndUpdate(
            req.params.id,
            {
                ...(title !== undefined && { title }),
                ...(description !== undefined && { description }),
                ...(status !== undefined && { status }),
                ...(priority !== undefined && { priority }),   // ✅ FIX
                ...(dueDate !== undefined && { dueDate })      // ✅ FIX
            },
            { new: true }
        );

        if (!updatedTask) {
            return res.status(404).json({
                success: false,
                message: "Task not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Task updated successfully",
            task: updatedTask
        });

    } catch (error) {
        console.error("Update Task Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to update task"
        });
    }
};

/* =========================
   DELETE TASK
========================= */
const deleteTask = async (req, res) => {
    try {
        const deletedTask = await Task.findByIdAndDelete(req.params.id);

        if (!deletedTask) {
            return res.status(404).json({
                success: false,
                message: "Task not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Task deleted successfully"
        });

    } catch (error) {
        console.error("Delete Task Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to delete task"
        });
    }
};

module.exports = {
    createTask,
    getTasksByUser,
    updateTask,
    deleteTask
};