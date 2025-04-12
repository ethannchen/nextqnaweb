/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import { AppError } from "../utils/errorUtils";

/**
 * Central error handling middleware
 * This middleware should be registered after all routes
 */
export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response
): void => {
  console.error("Error:", err);

  // Handle OpenAPI validation errors
  const isOpenApiError =
    err?.constructor?.name === "OpenAPIError" ||
    ((err as any)?.status === 400 && (err as any)?.errors);

  if (isOpenApiError) {
    const openApiErr = err as any;
    res.status(openApiErr.status || 400).json({
      error: openApiErr.message || "Validation Error",
      details: openApiErr.errors || [],
    });
    return;
  }

  // Handle our custom AppError instances
  if (err instanceof AppError) {
    res.status(err.status).json({
      error: err.message,
      ...(err.data && { details: err.data }),
    });
    return;
  }

  // Handle Mongoose validation errors
  if (err.name === "ValidationError") {
    res.status(400).json({
      error: "Validation Error",
      details: err.message,
    });
    return;
  }

  // Handle Mongoose duplicate key errors
  if (err.name === "MongoError" && (err as any).code === 11000) {
    res.status(409).json({
      error: "Duplicate Key Error",
      details: "A record with this information already exists",
    });
    return;
  }

  // Handle JWT errors
  if (err.name === "JsonWebTokenError") {
    res.status(401).json({
      error: "Invalid token",
      details: err.message,
    });
    return;
  }

  // Handle other JWT errors
  if (err.name === "TokenExpiredError") {
    res.status(401).json({
      error: "Token expired",
      details: err.message,
    });
    return;
  }

  // Default error handler for unhandled errors
  res.status(500).json({
    error: "Internal Server Error",
    details:
      process.env.NODE_ENV === "production"
        ? "An unexpected error occurred"
        : err.message,
  });
};
