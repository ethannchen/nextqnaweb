import { rateLimit } from "express-rate-limit";
import { Request } from "express";
import { AppError } from "../utils/errorUtils";

/**
 * Factory function to create rate limiter middleware with custom settings
 * In test environment, applies very high limits that won't be reached
 *
 * @param options - Configuration options for the rate limiter
 * @param options.windowMs - Time window in milliseconds
 * @param options.max - Maximum number of requests per window
 * @param options.message - Error message when limit is reached
 * @param options.standardHeaders - Whether to return rate limit info in headers
 * @param options.legacyHeaders - Whether to use legacy X-RateLimit headers
 * @param options.keyGenerator - Function to generate keys for rate limiting
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
  // Check if we're in a testing environment
  const isTestEnvironment = process.env.NODE_ENV === "test";

  if (isTestEnvironment) {
    return rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 1000000, // Very high limit that won't be reached in tests
      standardHeaders: true,
      legacyHeaders: false,
    });
  }
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
 * General API rate limiter for all routes
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
