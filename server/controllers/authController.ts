import { Request, Response } from "express";
import User from "../models/users";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { BadRequestError, UnauthorizedError } from "../utils/errorUtils";
import asyncHandler from "express-async-handler";

dotenv.config();

/**
 * Controller for user signup
 * Expects sanitized inputs from the sanitizeInputMiddleware
 */
export const signup = asyncHandler(async (req: Request, res: Response) => {
  const { username, email, password, role } = req.body;

  // Use the addNewUser method that encapsulates all the business logic
  const newUser = await User.addNewUser({
    username,
    email,
    password,
    role,
  }).catch((error) => {
    if (error.message === "Email is already registered") {
      throw new BadRequestError(error.message);
    }
    if (error.message === "Username is already taken") {
      throw new BadRequestError(error.message);
    }
    throw error;
  });

  // Respond with success
  res
    .status(201)
    .json({ message: `User ${newUser?.username} registered successfully` });
});

/**
 * Controller for user login
 * Expects sanitized inputs from the sanitizeInputMiddleware
 */
export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  // Find the user by email
  const user = await User.findByEmail(email);
  if (!user) throw new UnauthorizedError("Invalid credentials");

  // Check if password matches
  const isMatch = await user.comparePassword(password);
  if (!isMatch) throw new UnauthorizedError("Invalid credentials");

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
});
