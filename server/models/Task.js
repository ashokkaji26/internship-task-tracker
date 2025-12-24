const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
    {
        /* =========================
           BASIC INFO
        ========================= */
        title: {
            type: String,
            required: [true, "Task title is required"],
            trim: true
        },

        description: {
            type: String,
            trim: true,
            default: ""
        },

        /* =========================
           STATUS & PRIORITY
        ========================= */
        status: {
            type: String,
            enum: ["pending", "in-progress", "completed"],
            default: "pending"
        },

        priority: {
            type: String,
            enum: ["low", "medium", "high"],
            default: "medium"
        },

        /* =========================
           DUE DATE
        ========================= */
        dueDate: {
            type: Date,
            default: null
        },

        /* =========================
           USER RELATION
        ========================= */
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "User reference is required"]
        }
    },
    {
        timestamps: true // adds createdAt & updatedAt automatically
    }
);

module.exports = mongoose.model("Task", taskSchema);