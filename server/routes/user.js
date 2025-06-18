import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import User from "../models/User.js";

const router = express.Router();

// --- Get all users (for chat sidebar) ---
router.get("/", authMiddleware, async (req, res) => {
  try {
    // --- Fetch all users with only _id, username, and name fields ---
    const users = await User.find({}, "_id username name");
    res.json(users);
  } catch (err) {
    // --- Handle errors ---
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

export default router;