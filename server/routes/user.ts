import express from "express";
import { validateUserProfileMiddleware } from "../middlewares/validateUserProfileMiddleware";
import { authenticate } from "../middlewares/authMiddleware";
import {
  changePassword,
  deleteAccount,
  updateProfile,
} from "../controllers/userController";

const router = express.Router();

// Update user profile route
router.put(
  "/profile",
  authenticate,
  validateUserProfileMiddleware,
  updateProfile
);

// Change password route
router.put("/changePassword", authenticate, changePassword);

// Delete account route
router.delete("/account", authenticate, deleteAccount);
export default router;
