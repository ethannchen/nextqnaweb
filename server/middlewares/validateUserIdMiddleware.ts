import { Request, Response, NextFunction } from "express";
import { param, validationResult } from "express-validator";

export interface RequestWithUserId extends Request {
  params: {
    userId: string;
  };
}

// Create a validator specifically for userId
const userIdValidator = param("userId")
  .notEmpty()
  .withMessage("User ID is required")
  .isString()
  .withMessage("User ID must be a string")
  .isMongoId() // Assuming MongoDB IDs, replace with appropriate validation if using another format
  .withMessage("User ID must be a valid ID format");

export const validateUserIdMiddleware = [
  // Apply userId validator
  userIdValidator,

  // Process validation results
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];
