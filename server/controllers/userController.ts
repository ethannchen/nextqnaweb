import { Request, Response } from "express";
import User from "../models/users";
import dotenv from "dotenv";
import { RequestWithProfileInfo } from "../middlewares/validateUserProfileMiddleware";

dotenv.config();

const updateProfile = async (req: RequestWithProfileInfo, res: Response) => {
  try {
    const { username, email, bio, website } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: "Authentication required" });
    }

    if (!username || !email || !bio || !website) {
      return res.status(400).json({ error: "No fields to update" });
    }

    const updatedUser = await User.updateProfile(userId, {
      username,
      email,
      bio,
      website,
    });

    // Return updated user data
    res.json({ user: updatedUser });
  } catch (error) {
    // Handle specific error types
    if (error instanceof Error) {
      if (error.message === "User not found") {
        return res.status(404).json({ error: error.message });
      }
      if (
        error.message === "Username is already taken" ||
        error.message === "Email is already registered"
      ) {
        return res.status(400).json({ error: error.message });
      }
    }

    // Log generic errors
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

const changePassword = async (req: Request, res: Response) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: "Authentication required" });
    }

    // Use the changePassword method from the User model
    await User.changePassword(userId, currentPassword, newPassword);

    res.json({ message: "Password updated successfully" });
  } catch (error) {
    // Handle specific error types
    if (error instanceof Error) {
      if (error.message === "User not found") {
        return res.status(404).json({ error: error.message });
      }
      if (error.message === "Current password is incorrect") {
        return res.status(400).json({ error: error.message });
      }
      if (error.message === "Current password and new password are required") {
        return res.status(400).json({ error: error.message });
      }
    }

    // Log generic errors
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

const deleteAccount = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: "Authentication required" });
    }

    await User.deleteUser(userId);

    res.json({ message: "Account deleted successfully" });
  } catch (error) {
    // Handle specific error types
    if (error instanceof Error) {
      if (error.message === "User not found") {
        return res.status(404).json({ error: error.message });
      }
    }

    // Log generic errors
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};
export { updateProfile, changePassword, deleteAccount };
