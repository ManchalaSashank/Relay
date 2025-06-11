import express from "express";
import { getMessages } from "../controller/messageController.js";

const router = express.Router();
router.get("/:userId", getMessages);

export default router;
