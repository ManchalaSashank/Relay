import User from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const bcryptSalt = bcrypt.genSaltSync(10);

// ==============================
//  SIGNUP CONTROLLER
// ==============================
export const signup = async (req, res) => {
  const { name, username, password } = req.body;

  const foundUser = await User.findOne({ username });
  if (foundUser) {
    return res.json({ message: "User already exists", valid: false });
  }

  const hashedPassword = bcrypt.hashSync(password, bcryptSalt);

  const newUser = await User.create({
    name,
    username,
    password: hashedPassword,
  });

  const token = jwt.sign(
    { userId: newUser._id, username },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  res.cookie("token", token, {
    sameSite: "none",
    secure: true,
    maxAge: 1000 * 60 * 60 * 24,
  });

  res.status(201).json({
    id: newUser._id,
    valid: true,
  });
};



// ==============================
//  LOGIN CONTROLLER
// ==============================
export const login = async (req, res) => {
  const { username, password } = req.body;

  const foundUser = await User.findOne({ username });

  if (!foundUser || !bcrypt.compareSync(password, foundUser.password)) {
    return res.json({ message: "Invalid credentials", valid: false });
  }

  // Generate JWT token
  const token = jwt.sign(
    { userId: foundUser._id, username },
    process.env.JWT_SECRET,
    { expiresIn: "1d" } 

  );

  res.cookie("token", token, { sameSite: "none", secure: true }).json({
    id: foundUser._id,
    valid: true,
    maxAge: 1000 * 60 * 60 * 24
  });
};

// ==============================
//  LOGOUT CONTROLLER
// ==============================
export const logout = (req, res) => {
  res.cookie("token", "", { sameSite: "none", secure: true }).json({
    status: "ok",
  });
};

// ==============================
//  PROFILE CONTROLLER
// ==============================
export const profile = (req, res) => {
  const token = req.cookies?.token;

  if (!token) return res.json({ valid: false });

  jwt.verify(token, process.env.JWT_SECRET, {}, (err, userData) => {
    if (err) return res.json({ valid: false });

    res.json({ ...userData, valid: true });
  });
};
