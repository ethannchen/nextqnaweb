import { body } from "express-validator";

// Username validation
export const usernameValidator = body("username")
  .notEmpty()
  .withMessage("Username is required")
  .isLength({ min: 3, max: 30 })
  .withMessage("Username must be between 3 and 30 characters")
  .matches(/^[a-zA-Z0-9_]+$/)
  .withMessage("Username can only contain letters, numbers, and underscores");

// Email validation
export const emailValidator = body("email")
  .notEmpty()
  .withMessage("Email is required")
  .isEmail()
  .withMessage("Must provide a valid email address")
  .normalizeEmail();

// Password validation
export const passwordValidator = body("password")
  .notEmpty()
  .withMessage("Password is required")
  .isLength({ min: 8 })
  .withMessage("Password must be at least 8 characters long")
  .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
  .withMessage(
    "Password must contain at least one uppercase letter, one lowercase letter, and one number"
  );

// Role validation (optional)
export const roleValidator = body("role")
  .optional()
  .isIn(["user", "admin"])
  .withMessage('Role must be either "user" or "admin"');

// Bio validation
export const bioValidator = body("bio")
  .optional()
  .isLength({ max: 1000 })
  .withMessage("Bio cannot exceed 1000 characters")
  .customSanitizer((value) => {
    if (!value) return value;
    // Simple HTML escaping
    return value
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  });

// Website validation
export const websiteValidator = body("website")
  .optional()
  .custom((value) => {
    // Allow null or undefined
    if (value === null || value === undefined || value === "") {
      return true;
    }
    // Check if it's a valid URL
    try {
      new URL(value);
      return true;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      return false;
    }
  })
  .withMessage("Website must be a valid URL or null");
