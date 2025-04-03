import express, { Request, Response } from "express";
import User from "../models/users";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import {
  validateSignupMiddleware,
  RequestWithSignupInfo,
} from "../sanitizers/validateSignupMiddleware";

dotenv.config();
const router = express.Router();

// Sign-up route
router.post(
  "/signup",
  validateSignupMiddleware,
  async (req: RequestWithSignupInfo, res: Response) => {
    const { username, email, password } = req.body;

    try {
      // Check if the email already exists
      const existingUserByEmail = await User.findByEmail(email);
      if (existingUserByEmail) {
        return res.status(400).json({ error: "Email is already registered" });
      }

      // Check if the username already exists
      const existingUserByUsername = await User.findByUsername(username);
      if (existingUserByUsername) {
        return res.status(400).json({ error: "Username is already taken" });
      }

      const newUser = await User.createUser({ username, email, password });

      // Respond with success
      res
        .status(201)
        .json({ message: `User ${newUser.username} registered successfully` });
    } catch (error) {
      console.error(error); // Log error for debugging
      res
        .status(500)
        .json({ error: "Internal Server Error. Please try again later." });
    }
  }
);

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
