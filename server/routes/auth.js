import express from "express";
import { signup, login, logout, profile } from "../controller/authController.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.get("/profile", profile);

export default router;
