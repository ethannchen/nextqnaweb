import { Request, Response } from "express";
import User from "../models/users";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { BadRequestError, UnauthorizedError } from "../utils/errorUtils";
import asyncHandler from "express-async-handler";

dotenv.config();

/**
 * @route POST /signup
 * @description Registers a new user
 * @param {string} username - The username of the new user
 * @param {string} email - The email of the new user
 * @param {string} password - The password of the new user
 * @param {string} role - The role of the new user (e.g., "user", "admin")
 * @returns {201} JSON response with success message
 * @returns {400} JSON error if required fields are missing or if email/username already exists
 * @returns {500} JSON error if there is an internal server error
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
    .json({ message: `User ${newUser.username} registered successfully` });
});

/**
 * @route POST /login
 * @description Authenticates a user and returns a JWT token
 * @param {string} email - The email of the user
 * @param {string} password - The password of the user
 * @returns {200} JSON response with the JWT token and user data
 * @returns {401} JSON error if credentials are invalid
 * @returns {500} JSON error if there is an internal server error
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
