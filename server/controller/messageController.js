import Message from "../models/Message.js";
import jwt from "jsonwebtoken";

export const getMessages = async (req, res) => {
  const token = req.cookies?.token;
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  jwt.verify(token, process.env.JWT_SECRET, {}, async (err, userData) => {
    if (err) return res.status(403).json({ message: "Invalid token" });

    const { userId: ourUserId } = userData;
    const { userId } = req.params;

    const messages = await Message.find({
      sender: { $in: [ourUserId, userId] },
      recipient: { $in: [ourUserId, userId] },
    }).sort({ createdAt: 1 });

    res.json(messages);
  });
};
