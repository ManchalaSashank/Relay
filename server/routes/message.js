// import express from "express";
// import multer from "multer";
// import multerS3 from "multer-s3";
// import s3 from "../config/s3.js";
// import { getMessages } from "../controller/messageController.js";
// import { authMiddleware } from "../middleware/authMiddleware.js";
// import Message from "../models/Message.js";
// import dotenv from "dotenv";

// dotenv.config();

// const router = express.Router();

// // Set up multer-s3
// const upload = multer({
//   storage: multerS3({
//     s3,
//     bucket: process.env.AWS_S3_BUCKET,
//     metadata: (req, file, cb) => {
//       cb(null, { fieldName: file.fieldname });
//     },
//     key: (req, file, cb) => {
//       const filename = `${Date.now()}-${file.originalname}`;
//       cb(null, filename);
//     },
//   }),
// });

// // ✅ GET previous messages
// router.get("/:userId", authMiddleware, getMessages);

// // ✅ POST file message
// router.post("/upload", authMiddleware, upload.single("file"), async (req, res) => {
//   const { recipient, text } = req.body;

//   console.log("req.file:", req.file);           // debug
//   console.log("file location:", req.file?.location); // debug

//   if (!req.file || !recipient) {
//     return res.status(400).json({ error: "File and recipient are required." });
//   }

//   const fileUrl = req.file.location;

//   const message = await Message.create({
//     sender: req.userId,
//     recipient,
//     text: text || "",
//     file: fileUrl, // ✅ THIS LINE ADDS FILE URL
//   });

//   res.status(201).json(message);
// });

// // ✅ Send text-only messages (not using S3)
// router.post("/send", authMiddleware, async (req, res) => {
//   const { recipient, text } = req.body;

//   if (!recipient || !text) {
//     return res.status(400).json({ error: "Recipient and text are required." });
//   }

//   try {
//     const message = await Message.create({
//       sender: req.userId,
//       recipient,
//       text,
//     });

//     res.status(201).json(message);
//   } catch (err) {
//     res.status(500).json({ error: "Failed to send message" });
//   }
// });


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

// --- Multer S3 setup for file uploads ---
const upload = multer({
  storage: multerS3({
    s3,
    bucket: process.env.AWS_S3_BUCKET,
    // acl: "public-read", // <-- REMOVED
    metadata: (req, file, cb) => {
      cb(null, { fieldName: file.fieldname });
    },
    key: (req, file, cb) => {
      const filename = `${Date.now()}-${file.originalname}`;
      cb(null, filename);
    },
  }),
});

// --- Get previous messages between users ---
router.get("/:userId", authMiddleware, getMessages);

// --- Upload and send a file message ---
router.post("/upload", authMiddleware, upload.single("file"), async (req, res) => {
  const { recipient, text } = req.body;
  if (!req.file || !recipient) {
    return res.status(400).json({ error: "File and recipient are required." });
  }
  const fileUrl = req.file.location;

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