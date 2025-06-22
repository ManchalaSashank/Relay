import express from "express";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import { getMessages } from "../controller/messageController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import Message from "../models/Message.js";

dotenv.config();

// --- Cloudinary config ---
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// --- Multer Cloudinary setup for file uploads ---
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "chat_uploads", // optional: folder name in Cloudinary
    allowed_formats: ["jpg", "jpeg", "png", "gif"],
  },
});
const upload = multer({ storage });

const router = express.Router();

// --- Get previous messages between users ---
router.get("/:userId", authMiddleware, getMessages);

// --- Upload and send a file message ---
router.post("/upload", authMiddleware, upload.single("file"), async (req, res) => {
  const { recipient, text } = req.body;
  if (!req.file || !recipient) {
    return res.status(400).json({ error: "File and recipient are required." });
  }
  const fileUrl = req.file.path; // Cloudinary returns the URL in 'path'

  // --- Create message with file URL ---
  const message = await Message.create({
    sender: req.userId,
    recipient,
    text: text || "",
    file: fileUrl,
  });

  res.status(201).json(message);
});

export default router;