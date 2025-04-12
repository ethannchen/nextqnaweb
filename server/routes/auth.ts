import express from "express";
import { login, signup } from "../controllers/authController";
import { sanitizeInputMiddleware } from "../middlewares/sanitizeInputMiddleware";

const router = express.Router();

// Sign-up route with sanitization middleware
router.post("/signup", sanitizeInputMiddleware, signup);

// Login route with sanitization middleware
router.post("/login", sanitizeInputMiddleware, login);

export default router;
