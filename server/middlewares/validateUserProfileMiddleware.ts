import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import {
  usernameValidator,
  emailValidator,
  bioValidator,
  websiteValidator,
} from "../utils/validators";

export interface RequestWithProfileInfo extends Request {
  body: {
    username?: string;
    email?: string;
    bio?: string;
    website?: string | null;
  };
}

export const validateUserProfileMiddleware = [
  // Import only the validators needed for profile updates
  usernameValidator,
  emailValidator,
  bioValidator,
  websiteValidator,

  // Process validation results
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];
