import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/users";
import mongoose from "mongoose";
import { UnauthorizedError, ForbiddenError } from "../utils/errorUtils";
import asyncHandler from "express-async-handler";

interface UserPayload {
  id: string;
}

/**
 * Extend the Express Request interface to include user property
 */
declare module "express" {
  interface Request {
    user?: {
      id: mongoose.Types.ObjectId;
      role: string;
    };
  }
}

/**
 * Authentication middleware that verifies JWT tokens from request headers
 *
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function
 * @throws {UnauthorizedError} If token is missing, invalid, or user not found
 */
export const authenticate = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    // Get token from header
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new UnauthorizedError("No token, authorization denied");
    }

    // Verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as UserPayload;

    // Find user by id
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      throw new UnauthorizedError("User not found");
    }

    // Add user to request object
    req.user = {
      id: user._id,
      role: user.role,
    };

    next();
  }
);

/**
 * Middleware to verify user has admin role
 *
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function
 * @throws {ForbiddenError} If user is not an admin
 */
export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    next(new ForbiddenError("Access denied. Admin privileges required."));
  }
};
