import { Request, Response, NextFunction } from "express";
import { body, validationResult } from "express-validator";

export interface RequestWithSignupInfo extends Request {
  body: {
    username: string;
    email: string;
    password: string;
    role?: string;
    bio?: string;
    website?: string;
  };
}

export const validateSignupMiddleware = [
  // Username validation
  body("username")
    .notEmpty()
    .withMessage("Username is required")
    .isLength({ min: 3, max: 30 })
    .withMessage("Username must be between 3 and 30 characters")
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage("Username can only contain letters, numbers, and underscores"),

  // Email validation
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Must provide a valid email address")
    .normalizeEmail(),

  // Password validation
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage(
      "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    ),

  // Role validation (optional)
  body("role")
    .optional()
    .isIn(["user", "admin"])
    .withMessage('Role must be either "user" or "admin"'),

  // Website validation (optional)
  body("website").optional().isURL().withMessage("Must provide a valid URL"),

  // Process validation results
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];
