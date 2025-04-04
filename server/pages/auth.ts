import express, { Request, Response } from "express";
import User from "../models/users";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import {
  validateSignupMiddleware,
  RequestWithSignupInfo,
} from "../sanitizers/validateSignupMiddleware";
import { authenticate } from "../middlewares/authMiddleware";

dotenv.config();
const router = express.Router();

// Sign-up route
router.post(
  "/signup",
  validateSignupMiddleware,
  async (req: RequestWithSignupInfo, res: Response) => {
    const { username, email, password, role, bio, website } = req.body;

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

      const newUser = await User.createUser({
        username,
        email,
        password,
        role: role || "user",
        bio,
        website,
      });

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
  try {
    const { email, password } = req.body;

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "Invalid credentials" });

    // Check if password matches
    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    // Create and sign the JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET as string, {
      expiresIn: "1d",
    });

    // Return token and user data
    res.json({
      token,
      user: {
        id: user._id.toString(),
        username: user.username,
        email: user.email,
        role: user.role,
        bio: user.bio,
        website: user.website,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

// Update user profile route
router.put(
  "/profile",
  authenticate,
  validateSignupMiddleware,
  async (req: Request, res: Response) => {
    try {
      const { username, email, bio, website } = req.body;
      const userId = req.user?.id;

      // Find user to update
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // If username is changing, check if it already exists
      if (username && username !== user.username) {
        const existingUser = await User.findByUsername(username);
        if (existingUser) {
          return res.status(400).json({ error: "Username is already taken" });
        }
        user.username = username;
      }

      // If email is changing, check if it already exists
      if (email && email !== user.email) {
        const existingUser = await User.findByEmail(email);
        if (existingUser) {
          return res.status(400).json({ error: "Email is already registered" });
        }
        user.email = email;
      }

      // Update optional fields if provided
      if (bio !== undefined) user.bio = bio;
      if (website !== undefined) user.website = website;

      // Save updated user
      await user.save();

      // Return updated user data
      res.json({
        user: {
          id: user._id.toString(),
          username: user.username,
          email: user.email,
          role: user.role,
          bio: user.bio,
          website: user.website,
        },
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server error" });
    }
  }
);

// Change password route
router.put(
  "/change-password",
  authenticate,
  async (req: Request, res: Response) => {
    try {
      const { currentPassword, newPassword } = req.body;
      const userId = req.user?.id;

      // Validate required fields
      if (!currentPassword || !newPassword) {
        return res.status(400).json({ error: "All fields are required" });
      }

      // Find the user
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Verify current password
      const isMatch = await user.comparePassword(currentPassword);
      if (!isMatch) {
        return res.status(400).json({ error: "Current password is incorrect" });
      }

      // Hash the new password
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);

      // Save updated user
      await user.save();

      res.json({ message: "Password updated successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server error" });
    }
  }
);

// Delete account route
router.delete("/account", authenticate, async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;

    // Find and delete the user
    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ message: "Account deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
