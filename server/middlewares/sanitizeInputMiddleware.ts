import { Request, Response, NextFunction } from "express";
import {
  sanitizeUsername,
  sanitizeEmail,
  sanitizePassword,
  sanitizeText,
  validateUrl,
} from "../utils/sanitizers";
import { BadRequestError } from "../utils/errorUtils";
import asyncHandler from "express-async-handler";

/**
 * Middleware for sanitizing and validating common input fields in requests
 * @description Processes and sanitizes common user input fields (username, email, password, bio, website)
 * from the request body. Throws appropriate error if validation fails. Replaces individual validation
 * middlewares since OpenAPI validation handles schema compliance checks.
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {NextFunction} next - Express next function
 * @throws {BadRequestError} When validation of input fields fails
 */
export const sanitizeInputMiddleware = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    // Sanitize common fields if they exist in the request body
    if (req.body) {
      // Sanitize user credentials
      if (req.body.username) {
        const sanitizedUsername = sanitizeUsername(req.body.username);
        if (!sanitizedUsername) {
          throw new BadRequestError(
            "Invalid username format. Username must be 3-30 characters and contain only letters, numbers, and underscores."
          );
        }
        req.body.username = sanitizedUsername;
      }

      if (req.body.email) {
        const sanitizedEmail = sanitizeEmail(req.body.email);
        if (!sanitizedEmail) {
          throw new BadRequestError("Invalid email format.");
        }
        req.body.email = sanitizedEmail;
      }

      if (req.body.password) {
        const sanitizedPassword = sanitizePassword(req.body.password);
        if (!sanitizedPassword) {
          throw new BadRequestError(
            "Invalid password format. Password must be at least 8 characters and include at least one letter and one number."
          );
        }
        req.body.password = sanitizedPassword;
      }

      // Sanitize bio if present
      if (req.body.bio !== undefined) {
        req.body.bio = sanitizeText(req.body.bio);
      }

      // Sanitize website if present
      if (req.body.website !== undefined) {
        req.body.website = validateUrl(req.body.website);
      }
    }

    next();
  }
);
