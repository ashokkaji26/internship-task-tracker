const express = require("express");
const {
    createUser,
    getUsers
} = require("../controllers/userController");

const router = express.Router();

/* =========================
   USER ROUTES
========================= */

// Register new user
router.post("/", createUser);

// Get all users (optional, for admin/debug)
router.get("/", getUsers);

module.exports = router;