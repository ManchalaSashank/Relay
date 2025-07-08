import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import connectDB from "./config/db.js";

import authRoutes from "./routes/auth.js";
import messageRoutes from "./routes/message.js";
import userRoutes from "./routes/user.js";
import { Server as SocketIOServer } from "socket.io";
import setupSocket from "./webSockets/socket.js";

dotenv.config();
connectDB();

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    credentials: true,
    origin: process.env.CLIENT_URL,
  })
);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/users", userRoutes);

const PORT = process.env.PORT;
const server = app.listen(PORT, () => console.log(`Server running on ${PORT}`));

const io = new SocketIOServer(server, {
  cors: {
    origin: "http://localhost:3000", 
    credentials: true, 
  },
});

setupSocket(io);