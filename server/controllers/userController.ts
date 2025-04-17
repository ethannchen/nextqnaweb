import { Request, Response } from "express";
import User from "../models/users";
import {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
} from "../utils/errorUtils";
import asyncHandler from "express-async-handler";

/**
 * @route POST /updateProfile
 * @description Updates the user's profile information
 * @param {string} username - The new username for the user
 * @param {string} email - The new email for the user
 * @param {string} bio - The new bio for the user
 * @param {string} website - The new website for the user
 * @returns {200} JSON response with the updated user data if successful
 * @returns {400} JSON error if required fields are missing or invalid
 * @returns {401} JSON error if authentication is required
 * @returns {404} JSON error if the user is not found
 */
export const updateProfile = asyncHandler(
  async (req: Request, res: Response) => {
    const { username, email, bio, website } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      throw new UnauthorizedError("Authentication required");
    }

    if (!username && !email && bio === undefined && website === undefined) {
      throw new BadRequestError("No fields to update");
    }

    const updatedUser = await User.updateProfile(userId, {
      username,
      email,
      bio,
      website,
    }).catch((error) => {
      if (error.message === "User not found") {
        throw new NotFoundError(error.message);
      }
      if (
        error.message === "Username is already taken" ||
        error.message === "Email is already registered"
      ) {
        throw new BadRequestError(error.message);
      }
      throw error;
    });

    // Return updated user data
    res.json({ user: updatedUser });
  }
);

/**
 * @route POST /changePassword
 * @description Changes the user's password
 * @param {string} currentPassword - The current password of the user
 * @param {string} newPassword - The new password for the user
 * @returns {200} JSON response with a success message if successful
 * @returns {400} JSON error if required fields are missing or invalid
 * @returns {401} JSON error if authentication is required
 * @returns {404} JSON error if the user is not found
 */
export const changePassword = asyncHandler(
  async (req: Request, res: Response) => {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      throw new UnauthorizedError("Authentication required");
    }

    // Use the changePassword method from the User model
    await User.changePassword(userId, currentPassword, newPassword).catch(
      (error) => {
        if (error.message === "User not found") {
          throw new NotFoundError(error.message);
        }
        if (error.message === "Current password is incorrect") {
          throw new BadRequestError(error.message);
        }
        if (
          error.message === "Current password and new password are required"
        ) {
          throw new BadRequestError(error.message);
        }
        throw error;
      }
    );

    res.json({ message: "Password updated successfully" });
  }
);

/**
 * @route DELETE /deleteAccount
 * @description Deletes the user's account
 * @returns {200} JSON response with a success message if successful
 * @returns {401} JSON error if authentication is required
 * @returns {404} JSON error if the user is not found
 */
export const deleteAccount = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.id;

    if (!userId) {
      throw new UnauthorizedError("Authentication required");
    }

    await User.deleteUser(userId).catch((error) => {
      if (error.message === "User not found") {
        throw new NotFoundError(error.message);
      }
      throw error;
    });

    res.json({ message: "Account deleted successfully" });
  }
);
