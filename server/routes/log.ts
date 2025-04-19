import express from "express";
import { getLogs, clearLogs } from "../controllers/logController";
import { authenticate, isAdmin } from "../middlewares/authMiddleware";

const router = express.Router();

/**  Apply authentication and admin middleware to all log routes */
router.use(authenticate, isAdmin);

/**  Get all logs */
router.get("/", getLogs);

/** Clear all logs */
router.delete("/", clearLogs);

export default router;
