import express from "express";
import { login, signup } from "../controllers/authController";
import { sanitizeInputMiddleware } from "../middlewares/sanitizeInputMiddleware";
import { authLimiter } from "../middlewares/rateLimitMiddleware";

const router = express.Router();

router.post("/signup", authLimiter, sanitizeInputMiddleware, signup);
router.post("/login", authLimiter, sanitizeInputMiddleware, login);

export default router;
