// import express from "express";
// import { getMessages } from "../controller/messageController.js";

// const router = express.Router();
// router.get("/:userId", getMessages);

// export default router;


import express from "express";
import multer from "multer";
import multerS3 from "multer-s3";
import s3 from "../config/s3.js";
import { getMessages } from "../controller/messageController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import Message from "../models/Message.js";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

// Set up multer-s3
const upload = multer({
  storage: multerS3({
    s3,
    bucket: process.env.AWS_S3_BUCKET,
    //acl: "public-read",
    metadata: (req, file, cb) => {
      cb(null, { fieldName: file.fieldname });
    },
    key: (req, file, cb) => {
      const filename = `${Date.now()}-${file.originalname}`;
      cb(null, filename);
    },
  }),
});

// ✅ GET previous messages
router.get("/:userId", authMiddleware, getMessages);

// ✅ POST file message
router.post("/upload", authMiddleware, upload.single("file"), async (req, res) => {
  const { recipient, text } = req.body;

  console.log("req.file:", req.file);           // debug
  console.log("file location:", req.file?.location); // debug

  if (!req.file || !recipient) {
    return res.status(400).json({ error: "File and recipient are required." });
  }

  const fileUrl = req.file.location;

  const message = await Message.create({
    sender: req.userId,
    recipient,
    text,
    file: fileUrl, // ✅ THIS LINE ADDS FILE URL
  });

  res.status(201).json(message);
});


export default router;
