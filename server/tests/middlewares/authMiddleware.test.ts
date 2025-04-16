// tests/authMiddleware.test.ts
import { authenticate, isAdmin } from "../../middlewares/authMiddleware";
import User from "../../models/users";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { Request, Response, NextFunction } from "express";
import { UnauthorizedError, ForbiddenError } from "../../utils/errorUtils";

// Mock the User model and jwt
jest.mock("../../models/users");
jest.mock("jsonwebtoken");

describe("Authentication Middleware", () => {
  // Mock request, response, and next function
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    // Reset mocks before each test
    mockRequest = {
      header: jest.fn(),
      user: undefined,
    };
    mockResponse = {};
    mockNext = jest.fn();
    jest.clearAllMocks();
  });

  describe("authenticate middleware", () => {
    it("should pass if valid token is provided", async () => {
      // Arrange
      const userId = new mongoose.Types.ObjectId();
      const mockUser = {
        _id: userId,
        role: "user",
      };

      // Mock jwt.verify to return a valid user payload
      (jwt.verify as jest.Mock).mockReturnValue({ id: userId.toString() });

      // Mock User.findById to return a valid user
      (User.findById as jest.Mock).mockReturnValue({
        select: jest.fn().mockResolvedValue(mockUser),
      });

      // Mock request with Bearer token
      mockRequest.header = jest.fn().mockReturnValue(`Bearer token123`);

      // Act
      await authenticate(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // Assert
      expect(jwt.verify).toHaveBeenCalledWith(
        "token123",
        process.env.JWT_SECRET
      );
      expect(User.findById).toHaveBeenCalledWith(userId.toString());
      expect(mockRequest.user).toEqual({
        id: userId,
        role: "user",
      });
      expect(mockNext).toHaveBeenCalled();
    });

    it("should throw UnauthorizedError if no token is provided", async () => {
      // Arrange
      mockRequest.header = jest.fn().mockReturnValue(undefined);

      // Act
      await authenticate(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // Assert
      expect(mockNext).toHaveBeenCalledWith(expect.any(UnauthorizedError));
    });

    it("should pass error to next if token verification fails", async () => {
      // Arrange
      mockRequest.header = jest.fn().mockReturnValue(`Bearer token123`);

      // Mock jwt.verify to throw an error
      (jwt.verify as jest.Mock).mockImplementation(() => {
        throw new Error("Invalid token");
      });

      // Act
      await authenticate(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // Assert
      expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
    });

    it("should pass UnauthorizedError to next if user is not found", async () => {
      // Arrange
      const userId = new mongoose.Types.ObjectId();

      // Mock jwt.verify to return a valid user payload
      (jwt.verify as jest.Mock).mockReturnValue({ id: userId.toString() });

      // Mock User.findById to return null (user not found)
      (User.findById as jest.Mock).mockReturnValue({
        select: jest.fn().mockResolvedValue(null),
      });

      // Mock request with Bearer token
      mockRequest.header = jest.fn().mockReturnValue(`Bearer token123`);

      // Act
      await authenticate(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // Assert
      expect(mockNext).not.toHaveBeenCalled();
    });
  });

  describe("isAdmin middleware", () => {
    it("should pass if user is admin", () => {
      // Arrange
      mockRequest.user = {
        id: new mongoose.Types.ObjectId(),
        role: "admin",
      };

      // Act
      isAdmin(mockRequest as Request, mockResponse as Response, mockNext);

      // Assert
      expect(mockNext).toHaveBeenCalled();
    });

    it("should call next with ForbiddenError if user is not admin", () => {
      // Arrange
      mockRequest.user = {
        id: new mongoose.Types.ObjectId(),
        role: "user",
      };

      // Act
      isAdmin(mockRequest as Request, mockResponse as Response, mockNext);

      // Assert
      expect(mockNext).toHaveBeenCalledWith(expect.any(ForbiddenError));
    });

    it("should call next with ForbiddenError if user is undefined", () => {
      // Arrange
      mockRequest.user = undefined;

      // Act
      isAdmin(mockRequest as Request, mockResponse as Response, mockNext);

      // Assert
      expect(mockNext).toHaveBeenCalledWith(expect.any(ForbiddenError));
    });
  });
});
