import { rateLimit } from "express-rate-limit";
import { Request } from "express";
import { AppError } from "../utils/errorUtils";

/**
 * Create a rate limit middleware with custom settings
 *
 * @param options Configuration options for the rate limiter
 * @returns Rate limiting middleware
 */
export const createRateLimiter = (options: {
  windowMs?: number;
  max?: number;
  message?: string;
  standardHeaders?: boolean;
  legacyHeaders?: boolean;
  keyGenerator?: (req: Request) => string;
}) => {
  const defaultOptions = {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per window
    message: "Too many requests from this IP, please try again later",
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  };

  return rateLimit({
    ...defaultOptions,
    ...options,
    handler: () => {
      throw new AppError(
        options.message || defaultOptions.message,
        429, // 429 Too Many Requests
        {
          limit: options.max || defaultOptions.max,
          windowMs: options.windowMs || defaultOptions.windowMs,
        }
      );
    },
  });
};

/**
 * General API rate limiter - apply to all routes
 * Limits to 100 requests per 15 minutes per IP
 */
export const generalLimiter = createRateLimiter({});

/**
 * Stricter rate limiter for authentication routes
 * Limits to 5 requests per minute per IP
 */
export const authLimiter = createRateLimiter({
  windowMs: 60 * 1000,
  max: 5,
  message: "Too many authentication attempts, please try again later",
});

/**
 * Moderate rate limiter for user profile operations
 * Limits to 10 requests per minute per IP
 */
export const userLimiter = createRateLimiter({
  windowMs: 60 * 1000,
  max: 10,
  message: "Too many profile update attempts, please try again later",
});
