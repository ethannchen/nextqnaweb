import { Request, Response } from "express";
import { loggerService } from "../utils/loggerService";
import { asyncHandler } from "../utils/errorUtils";

/**
 * Get all logs
 * Accessible only by admin users
 */
export const getLogs = asyncHandler(async (req: Request, res: Response) => {
  // Get all logs
  const logs = loggerService.getLogs();

  // Apply limit if specified
  const limit = req.query.limit ? Number(req.query.limit) : undefined;
  const limitedLogs = limit ? logs.slice(0, limit) : logs;

  res.json({
    count: limitedLogs.length,
    logs: limitedLogs,
  });
});

/**
 * Clear all logs
 * Accessible only by admin users
 */
export const clearLogs = asyncHandler(async (req: Request, res: Response) => {
  loggerService.clearLogs();
  res.json({ message: "All logs have been cleared" });
});
