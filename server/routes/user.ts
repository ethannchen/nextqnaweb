import express from "express";
import { authenticate } from "../middlewares/authMiddleware";
import { sanitizeInputMiddleware } from "../middlewares/sanitizeInputMiddleware";
import {
  changePassword,
  deleteAccount,
  updateProfile,
} from "../controllers/userController";

const router = express.Router();

// Update user profile route
router.put("/profile", authenticate, sanitizeInputMiddleware, updateProfile);

// Change password route
router.put(
  "/changePassword",
  authenticate,
  sanitizeInputMiddleware,
  changePassword
);

// Delete account route
router.delete("/account", authenticate, deleteAccount);

export default router;
