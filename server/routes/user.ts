import express from "express";
import { authenticate } from "../middlewares/authMiddleware";
import { sanitizeInputMiddleware } from "../middlewares/sanitizeInputMiddleware";
import {
  changePassword,
  deleteAccount,
  updateProfile,
} from "../controllers/userController";
import { userLimiter } from "../middlewares/rateLimitMiddleware"; // Import user limiter

const router = express.Router();

/**
 * routes to create user profile and change password
 * use middlewares to enable the rate limiter, authenticate
 * and sanitize input
 */
router.put(
  "/profile",
  userLimiter,
  authenticate,
  sanitizeInputMiddleware,
  updateProfile
);
router.put(
  "/changePassword",
  userLimiter,
  authenticate,
  sanitizeInputMiddleware,
  changePassword
);
router.delete("/account", userLimiter, authenticate, deleteAccount);

export default router;
