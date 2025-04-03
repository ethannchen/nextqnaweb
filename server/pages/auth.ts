import express, { Request, Response } from "express";
import User from "../models/users";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

// Sign-up route
router.post("/signup", async (req: Request, res: Response) => {
  const { username, email, password } = req.body;
  //   res.status(201).json({ message: "User registered successfully" });

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ error: "User already exists" });

    const newUser = new User({ username, email, password });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" + error });
  }
});

// Login route
router.post("/login", async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) return res.status(400).json({ error: "User not found" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET as string, {
    expiresIn: "1h",
  });
  res.json({
    token,
    user: { id: user._id, username: user.username, email: user.email },
  });
});

export default router;
