import { Request, Response, NextFunction } from "express";
import {
  sanitizeUsername,
  sanitizeEmail,
  sanitizePassword,
} from "./sanitization";

export interface RequestWithSignupInfo extends Request {
  username?: string;
  email?: string;
  password?: string;
}

export const validateSignupMiddleware = (
  req: RequestWithSignupInfo,
  res: Response,
  next: NextFunction
) => {
  const { username, email, password } = req.body;

  // Sanitize the inputs
  const sanitizedUsername = sanitizeUsername(username);
  const sanitizedEmail = sanitizeEmail(email);
  const sanitizedPassword = sanitizePassword(password);

  // Validate the username
  if (!sanitizedUsername) {
    return res
      .status(400)
      .send(
        "Invalid username: It must be alphanumeric with underscores, 3–30 characters."
      );
  }

  // Validate the email
  if (!sanitizedEmail) {
    return res
      .status(400)
      .send("Invalid email: It must be a valid email address.");
  }

  // Validate the password
  if (!sanitizedPassword) {
    return res
      .status(400)
      .send(
        "Invalid password: It must be at least 8 characters long, with at least 1 letter and 1 number."
      );
  }

  // Attach sanitized values to the request object
  req.username = sanitizedUsername;
  req.email = sanitizedEmail;
  req.password = sanitizedPassword;

  next();
};
