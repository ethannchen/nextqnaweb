import { Request, Response } from "express";
import User from "../models/users";
import {
  asyncHandler,
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
} from "../utils/errorUtils";

/**
 * Controller for updating user profile
 * Expects sanitized inputs from the sanitizeInputMiddleware
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
 * Controller for changing user password
 * Expects sanitized inputs from the sanitizeInputMiddleware
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
 * Controller for deleting user account
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
