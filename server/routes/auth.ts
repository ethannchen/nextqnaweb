import express from "express";
import { validateSignupMiddleware } from "../middlewares/validateSignupMiddleware";
import { validateLoginMiddleware } from "../middlewares/validateLoginMiddleware";
import { login, signup } from "../controllers/authController";

const router = express.Router();

// Sign-up route
router.post("/signup", validateSignupMiddleware, signup);

// Login route
router.post("/login", validateLoginMiddleware, login);

export default router;
