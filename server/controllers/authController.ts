import { Request, Response } from "express";
import User from "../models/users";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

/**
 * Controller for user signup
 * Expects sanitized inputs from the sanitizeInputMiddleware
 */
export const signup = async (req: Request, res: Response) => {
  const { username, email, password, role } = req.body;

  // Input validation is now handled by the sanitizeInputMiddleware
  // and OpenAPI validators, so we can assume inputs are valid

  try {
    // Use the addNewUser method that encapsulates all the business logic
    const newUser = await User.addNewUser({
      username,
      email,
      password,
      role,
    });

    // Respond with success
    res
      .status(201)
      .json({ message: `User ${newUser.username} registered successfully` });
  } catch (error) {
    // Handle specific error types
    if (error instanceof Error) {
      if (error.message === "Email is already registered") {
        return res.status(400).json({ error: error.message });
      }
      if (error.message === "Username is already taken") {
        return res.status(400).json({ error: error.message });
      }
    }

    // Log generic errors
    console.error(error);
    res
      .status(500)
      .json({ error: "Internal Server Error. Please try again later." });
  }
};

/**
 * Controller for user login
 * Expects sanitized inputs from the sanitizeInputMiddleware
 */
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Find the user by email
    const user = await User.findByEmail(email);
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
};
