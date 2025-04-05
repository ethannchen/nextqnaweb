import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import {
  usernameValidator,
  emailValidator,
  passwordValidator,
  roleValidator,
} from "../utils/validators";

export interface RequestWithSignupInfo extends Request {
  body: {
    username: string;
    email: string;
    password: string;
    role: string;
  };
}

export const validateSignupMiddleware = [
  // Import all validators
  usernameValidator,
  emailValidator,
  passwordValidator,
  roleValidator,

  // Process validation results
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];
