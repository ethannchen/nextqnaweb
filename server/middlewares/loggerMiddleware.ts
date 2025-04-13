import { Request, Response, NextFunction } from "express";
import { loggerService } from "../utils/loggerService";

/**
 * Middleware for logging API requests
 * Captures request details at the beginning and completes the log with response details
 */
export const loggerMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Skip logging for the logs endpoints to avoid recursive logging
  if (req.path.startsWith("/logs")) {
    return next();
  }

  // Record start time
  const startTime = Date.now();

  // Create initial log entry with request data
  const logEntry = {
    timestamp: new Date(),
    method: req.method,
    path: req.path,
    ip: req.ip || req.socket.remoteAddress || "unknown",
    userId: req.user?.id ? req.user.id.toString() : "unauthenticated",
    userAgent: req.get("User-Agent"),
  };

  // Function to finalize and store the log after response is sent
  const finalizeLog = () => {
    // Calculate response time
    const responseTime = Date.now() - startTime;

    // Add response details to log entry
    loggerService.addLog({
      ...logEntry,
      statusCode: res.statusCode,
      responseTime,
    });
  };

  // Listen for response finish event to capture final status code
  res.on("finish", finalizeLog);

  next();
};
