import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/users";
import mongoose from "mongoose";

interface UserPayload {
  id: string;
}

// Extend the Express Request interface to include user property
declare module "express" {
  interface Request {
    user?: {
      id: mongoose.Types.ObjectId;
      role: string;
    };
  }
}

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Get token from header
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(400).json({ error: "No token, authorization denied" });
    }

    // Verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as UserPayload;

    // Find user by id
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    // Add user to request object
    req.user = {
      id: user._id,
      role: user.role,
    };

    next();
  } catch (err) {
    res.status(400).json({ error: "Token is not valid: " + err });
  }
};

// Middleware to check if user is admin
export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res
      .status(403)
      .json({ error: "Access denied. Admin privileges required." });
  }
};
