import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import { emailValidator, passwordValidator } from "../utils/validators";

export interface RequestWithLoginInfo extends Request {
  body: {
    email: string;
    password: string;
  };
}

export const validateLoginMiddleware = [
  // Import only email and password validators
  emailValidator,
  passwordValidator,

  // Process validation results
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];
