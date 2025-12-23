const User = require("../models/User");

/* =========================
   CREATE USER
========================= */
const createUser = async (req, res) => {
    try {
        console.log("Incoming user request:", req.body);

        const { name, email, role } = req.body;

        if (!name || !email) {
            return res.status(400).json({
                success: false,
                message: "Name and email are required"
            });
        }

        const normalizedEmail = email.toLowerCase();

        const existingUser = await User.findOne({ email: normalizedEmail });

        // 🔁 USER ALREADY EXISTS (used for login flow)
        if (existingUser) {
            console.log("User already exists:", existingUser.email);
            return res.status(400).json({
                success: false,
                message: "User already exists"
            });
        }

        const user = await User.create({
            name: name.trim(),
            email: normalizedEmail,
            role: role === "mentor" ? "mentor" : "student"
        });

        console.log("User created successfully:", user._id);

        return res.status(201).json({
            success: true,
            message: "User registered successfully",
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        });

    } catch (error) {
        console.error("User creation error:", error);
        return res.status(500).json({
            success: false,
            message: "Server error while creating user"
        });
    }
};

/* =========================
   GET ALL USERS
========================= */
const getUsers = async (req, res) => {
    try {
        const users = await User.find();

        return res.status(200).json({
            success: true,
            users
        });
    } catch (error) {
        console.error("Fetch users error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch users"
        });
    }
};

module.exports = {
    createUser,
    getUsers
};