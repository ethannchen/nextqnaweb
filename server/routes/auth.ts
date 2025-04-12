import express from "express";
import { login, signup } from "../controllers/authController";
import { sanitizeInputMiddleware } from "../middlewares/sanitizeInputMiddleware";

const router = express.Router();

router.post("/signup", sanitizeInputMiddleware, signup);

router.post("/login", sanitizeInputMiddleware, login);

export default router;
