/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response, NextFunction } from "express";
import { errorHandler } from "../../middlewares/errorMiddleware";
import {
  AppError,
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
} from "../../utils/errorUtils";
import mongoose from "mongoose";

describe("Error Middleware", () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: jest.Mock<NextFunction>;
  let jsonSpy: jest.SpyInstance;
  let statusSpy: jest.SpyInstance;

  beforeEach(() => {
    mockRequest = {};
    mockResponse = {
      json: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis(),
    };
    mockNext = jest.fn();

    jsonSpy = jest.spyOn(mockResponse, "json");
    statusSpy = jest.spyOn(mockResponse, "status");
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should handle AppError instances with correct status and message", () => {
    const appError = new AppError("Test app error", 418, {
      customData: "test",
    });

    errorHandler(
      appError,
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    expect(statusSpy).toHaveBeenCalledWith(418);
    expect(jsonSpy).toHaveBeenCalledWith({
      error: "Test app error",
      details: { customData: "test" },
    });
  });

  it("should handle BadRequestError correctly", () => {
    const badRequestError = new BadRequestError("Invalid input data");

    errorHandler(
      badRequestError,
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    expect(statusSpy).toHaveBeenCalledWith(400);
    expect(jsonSpy).toHaveBeenCalledWith({
      error: "Invalid input data",
    });
  });

  it("should handle UnauthorizedError correctly", () => {
    const unauthorizedError = new UnauthorizedError("Authentication required");

    errorHandler(
      unauthorizedError,
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    expect(statusSpy).toHaveBeenCalledWith(401);
    expect(jsonSpy).toHaveBeenCalledWith({
      error: "Authentication required",
    });
  });

  it("should handle ForbiddenError correctly", () => {
    const forbiddenError = new ForbiddenError("Insufficient permissions");

    errorHandler(
      forbiddenError,
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    expect(statusSpy).toHaveBeenCalledWith(403);
    expect(jsonSpy).toHaveBeenCalledWith({
      error: "Insufficient permissions",
    });
  });

  it("should handle NotFoundError correctly", () => {
    const notFoundError = new NotFoundError("Resource not found");

    errorHandler(
      notFoundError,
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    expect(statusSpy).toHaveBeenCalledWith(404);
    expect(jsonSpy).toHaveBeenCalledWith({
      error: "Resource not found",
    });
  });

  it("should handle Mongoose validation errors correctly", () => {
    const validationError = new mongoose.Error.ValidationError();
    validationError.message = "Validation failed";

    errorHandler(
      validationError,
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    expect(statusSpy).toHaveBeenCalledWith(400);
    expect(jsonSpy).toHaveBeenCalledWith({
      error: "Validation Error",
      details: "Validation failed",
    });
  });

  it("should handle Mongoose duplicate key errors correctly", () => {
    const duplicateKeyError = new Error("E11000 duplicate key error");
    (duplicateKeyError as any).name = "MongoError";
    (duplicateKeyError as any).code = 11000;

    errorHandler(
      duplicateKeyError,
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    expect(statusSpy).toHaveBeenCalledWith(409);
    expect(jsonSpy).toHaveBeenCalledWith({
      error: "Duplicate Key Error",
      details: "A record with this information already exists",
    });
  });

  it("should handle JWT errors correctly", () => {
    const jwtError = new Error("Invalid signature");
    jwtError.name = "JsonWebTokenError";

    errorHandler(
      jwtError,
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    expect(statusSpy).toHaveBeenCalledWith(401);
    expect(jsonSpy).toHaveBeenCalledWith({
      error: "Invalid token",
      details: "Invalid signature",
    });
  });

  it("should handle expired JWT errors correctly", () => {
    const tokenExpiredError = new Error("jwt expired");
    tokenExpiredError.name = "TokenExpiredError";

    errorHandler(
      tokenExpiredError,
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    expect(statusSpy).toHaveBeenCalledWith(401);
    expect(jsonSpy).toHaveBeenCalledWith({
      error: "Token expired",
      details: "jwt expired",
    });
  });

  it("should handle unhandled errors in production mode", () => {
    const originalNodeEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = "production";

    const unhandledError = new Error("Server crashed unexpectedly");

    errorHandler(
      unhandledError,
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    expect(statusSpy).toHaveBeenCalledWith(500);
    expect(jsonSpy).toHaveBeenCalledWith({
      error: "Internal Server Error",
      details: "An unexpected error occurred",
    });

    // Restore original NODE_ENV
    process.env.NODE_ENV = originalNodeEnv;
  });

  it("should handle unhandled errors in development mode with detailed message", () => {
    const originalNodeEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = "development";

    const unhandledError = new Error("Database connection failed");

    errorHandler(
      unhandledError,
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    expect(statusSpy).toHaveBeenCalledWith(500);
    expect(jsonSpy).toHaveBeenCalledWith({
      error: "Internal Server Error",
      details: "Database connection failed",
    });

    // Restore original NODE_ENV
    process.env.NODE_ENV = originalNodeEnv;
  });
});
