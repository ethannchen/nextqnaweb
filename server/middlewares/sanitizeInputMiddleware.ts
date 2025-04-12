import { Request, Response, NextFunction } from "express";
import {
  sanitizeUsername,
  sanitizeEmail,
  sanitizePassword,
  sanitizeText,
  validateUrl,
} from "../utils/sanitizers";

/**
 * A general middleware for sanitizing common inputs in requests
 * This replaces individual validation middlewares since OpenAPI validation
 * handles schema compliance checks
 *
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function
 */
export const sanitizeInputMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Sanitize common fields if they exist in the request body
    if (req.body) {
      // Sanitize user credentials
      if (req.body.username) {
        const sanitizedUsername = sanitizeUsername(req.body.username);
        if (!sanitizedUsername) {
          return res.status(400).json({
            error:
              "Invalid username format. Username must be 3-30 characters and contain only letters, numbers, and underscores.",
          });
        }
        req.body.username = sanitizedUsername;
      }

      if (req.body.email) {
        const sanitizedEmail = sanitizeEmail(req.body.email);
        if (!sanitizedEmail) {
          return res.status(400).json({
            error: "Invalid email format.",
          });
        }
        req.body.email = sanitizedEmail;
      }

      if (req.body.password) {
        const sanitizedPassword = sanitizePassword(req.body.password);
        if (!sanitizedPassword) {
          return res.status(400).json({
            error:
              "Invalid password format. Password must be at least 8 characters and include at least one letter and one number.",
          });
        }
        req.body.password = sanitizedPassword;
      }

      // Sanitize bio if present using the sanitizeText utility
      if (req.body.bio !== undefined) {
        req.body.bio = sanitizeText(req.body.bio);
      }

      // Sanitize website if present using the validateUrl utility
      if (req.body.website !== undefined) {
        req.body.website = validateUrl(req.body.website);
      }
    }

    next();
  } catch (error) {
    console.error("Error in sanitizeInputMiddleware:", error);
    res
      .status(500)
      .json({ error: "Internal server error during input sanitization" });
  }
};
