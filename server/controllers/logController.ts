import { Request, Response } from "express";
import { loggerService } from "../utils/loggerService";
import asyncHandler from "express-async-handler";

/**
 * @route GET /logs
 * @description Retrieves all logs with optional limit
 * @param {number} limit - Optional limit for the number of logs to return
 * @returns {200} JSON response with the count and logs
 * @returns {500} JSON error if there is an internal server error
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
 * @route DELETE /logs
 * @description Clears all logs
 * @returns {200} JSON response with a success message
 * @returns {500} JSON error if there is an internal server error
 */
export const clearLogs = asyncHandler(async (req: Request, res: Response) => {
  loggerService.clearLogs();
  res.json({ message: "All logs have been cleared" });
});
