const Task = require("../models/Task");

/* =========================
   CREATE TASK
========================= */
const createTask = async (req, res) => {
    try {
        const { title, description, userId, deadline } = req.body;

        if (!title || !userId) {
            return res.status(400).json({
                success: false,
                message: "Title and User ID are required"
            });
        }

        const task = await Task.create({
            title,
            description,
            deadline,
            user: userId
        });

        return res.status(201).json({
            success: true,
            message: "Task added successfully",
            task
        });
    } catch (error) {
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
        const { title, description, status, deadline } = req.body;

        // ✅ Validate status if provided
        if (status && !["pending", "completed"].includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid task status"
            });
        }

        const updatedTask = await Task.findByIdAndUpdate(
            req.params.id,
            {
                ...(title && { title }),
                ...(description && { description }),
                ...(status && { status }),
                ...(deadline && { deadline })
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