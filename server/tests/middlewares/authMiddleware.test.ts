/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { authenticate, isAdmin } from "../../middlewares/authMiddleware";
import User from "../../models/users";
import mongoose from "mongoose";
import { UnauthorizedError, ForbiddenError } from "../../utils/errorUtils";

// Mock the jwt module
jest.mock("jsonwebtoken");

// Mock the User model
jest.mock("../../models/users");

// Mock express-async-handler
jest.mock("express-async-handler", () => (fn: any) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      return await fn(req, res, next);
    } catch (error) {
      return next(error);
    }
  };
});

describe("Authentication Middleware", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: jest.Mock;
  const originalEnv = process.env;

  beforeAll(() => {
    process.env = { ...originalEnv, JWT_SECRET: "test-jwt-secret" };
  });

  beforeEach(() => {
    req = {
      header: jest.fn(),
    };
    res = {};
    next = jest.fn();

    // Clear all mocks
    jest.clearAllMocks();
  });

  afterAll(() => {
    jest.restoreAllMocks();
    process.env = originalEnv;
  });

  describe("authenticate middleware", () => {
    it("should pass UnauthorizedError to next if no token is provided", async () => {
      // Setup
      (req.header as jest.Mock).mockReturnValue(undefined);

      // Execute
      await authenticate(req as Request, res as Response, next);

      // Assert
      expect(req.header).toHaveBeenCalledWith("Authorization");
      expect(next).toHaveBeenCalledWith(expect.any(UnauthorizedError));
      expect(next.mock.calls[0][0].message).toBe(
        "No token, authorization denied"
      );
    });

    it("should pass error to next if token is invalid", async () => {
      // Setup
      (req.header as jest.Mock).mockReturnValue("Bearer invalid-token");
      (jwt.verify as jest.Mock).mockImplementation(() => {
        throw new Error("Invalid token");
      });

      // Execute
      await authenticate(req as Request, res as Response, next);

      // Assert
      expect(req.header).toHaveBeenCalledWith("Authorization");
      expect(jwt.verify).toHaveBeenCalledWith(
        "invalid-token",
        "test-jwt-secret"
      );
      expect(next).toHaveBeenCalledWith(expect.any(Error));
    });

    it("should pass UnauthorizedError to next if user is not found", async () => {
      // Setup
      (req.header as jest.Mock).mockReturnValue("Bearer valid-token");
      (jwt.verify as jest.Mock).mockReturnValue({ id: "user-id" });
      (User.findById as jest.Mock).mockReturnValue({
        select: jest.fn().mockResolvedValue(null),
      });

      // Execute
      await authenticate(req as Request, res as Response, next);

      // Assert
      expect(req.header).toHaveBeenCalledWith("Authorization");
      expect(jwt.verify).toHaveBeenCalledWith("valid-token", "test-jwt-secret");
      expect(User.findById).toHaveBeenCalledWith("user-id");
      expect(next).toHaveBeenCalledWith(expect.any(UnauthorizedError));
      expect(next.mock.calls[0][0].message).toBe("User not found");
    });

    it("should add user to request and call next if token is valid", async () => {
      // Setup
      const mockUser = {
        _id: new mongoose.Types.ObjectId("507f1f77bcf86cd799439011"),
        role: "user",
      };

      (req.header as jest.Mock).mockReturnValue("Bearer valid-token");
      (jwt.verify as jest.Mock).mockReturnValue({ id: "user-id" });
      (User.findById as jest.Mock).mockReturnValue({
        select: jest.fn().mockResolvedValue(mockUser),
      });

      // Execute
      await authenticate(req as Request, res as Response, next);

      // Assert
      expect(req.header).toHaveBeenCalledWith("Authorization");
      expect(jwt.verify).toHaveBeenCalledWith("valid-token", "test-jwt-secret");
      expect(User.findById).toHaveBeenCalledWith("user-id");
      expect(req.user).toEqual({
        id: mockUser._id,
        role: mockUser.role,
      });
      expect(next).toHaveBeenCalledWith(); // next should be called with no arguments
    });

    it("should properly extract token from Authorization header with Bearer prefix", async () => {
      // Setup
      const mockUser = {
        _id: new mongoose.Types.ObjectId("507f1f77bcf86cd799439011"),
        role: "user",
      };

      (req.header as jest.Mock).mockReturnValue("Bearer my-token-123");
      (jwt.verify as jest.Mock).mockReturnValue({ id: "user-id" });
      (User.findById as jest.Mock).mockReturnValue({
        select: jest.fn().mockResolvedValue(mockUser),
      });

      // Execute
      await authenticate(req as Request, res as Response, next);

      // Assert
      expect(jwt.verify).toHaveBeenCalledWith(
        "my-token-123",
        "test-jwt-secret"
      );
      expect(next).toHaveBeenCalledWith(); // Verify next was called with no arguments
    });
  });

  describe("isAdmin middleware", () => {
    it("should call next if user is admin", () => {
      // Setup
      req.user = {
        id: new mongoose.Types.ObjectId("507f1f77bcf86cd799439011"),
        role: "admin",
      };

      // Execute
      isAdmin(req as Request, res as Response, next);

      // Assert
      expect(next).toHaveBeenCalled();
      expect(next.mock.calls[0][0]).toBeUndefined(); // next should be called without error
    });

    it("should call next with ForbiddenError if user is not admin", () => {
      // Setup
      req.user = {
        id: new mongoose.Types.ObjectId("507f1f77bcf86cd799439011"),
        role: "user",
      };

      // Execute
      isAdmin(req as Request, res as Response, next);

      // Assert
      expect(next).toHaveBeenCalled();
      expect(next.mock.calls[0][0]).toBeInstanceOf(ForbiddenError);
    });

    it("should call next with ForbiddenError if user is undefined", () => {
      // Setup
      req.user = undefined;

      // Execute
      isAdmin(req as Request, res as Response, next);

      // Assert
      expect(next).toHaveBeenCalled();
      expect(next.mock.calls[0][0]).toBeInstanceOf(ForbiddenError);
    });
  });
});
