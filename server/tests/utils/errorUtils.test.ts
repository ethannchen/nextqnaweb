/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  AppError,
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  asyncHandler,
} from "../../utils/errorUtils";
import { Request, Response } from "express";

// Create a proper mockable type for NextFunction
type NextFunction = (err?: any) => void;

describe("AppError", () => {
  it("should create an error with the provided message and default status code", () => {
    const error = new AppError("Test error");
    expect(error.message).toBe("Test error");
    expect(error.status).toBe(500);
    expect(error.name).toBe("AppError");
  });

  it("should create an error with the provided message, status code, and data", () => {
    const data = { key: "value" };
    const error = new AppError("Test error", 400, data);
    expect(error.message).toBe("Test error");
    expect(error.status).toBe(400);
    expect(error.data).toBe(data);
    expect(error.name).toBe("AppError");
  });

  it("should maintain proper inheritance from Error", () => {
    const error = new AppError("Test error");
    expect(error instanceof Error).toBe(true);
    expect(error instanceof AppError).toBe(true);
  });
});

describe("HTTP Error subclasses", () => {
  it("should create BadRequestError with the correct status code and default message", () => {
    const error = new BadRequestError();
    expect(error.message).toBe("Bad request");
    expect(error.status).toBe(400);
    expect(error instanceof AppError).toBe(true);
    expect(error instanceof BadRequestError).toBe(true);
  });

  it("should create BadRequestError with a custom message", () => {
    const error = new BadRequestError("Custom bad request message");
    expect(error.message).toBe("Custom bad request message");
    expect(error.status).toBe(400);
  });

  it("should create BadRequestError with a custom message and data", () => {
    const data = { field: "username", issue: "required" };
    const error = new BadRequestError("Invalid user data", data);
    expect(error.message).toBe("Invalid user data");
    expect(error.status).toBe(400);
    expect(error.data).toEqual(data);
  });

  it("should create UnauthorizedError with the correct status code and default message", () => {
    const error = new UnauthorizedError();
    expect(error.message).toBe("Unauthorized access");
    expect(error.status).toBe(401);
    expect(error instanceof AppError).toBe(true);
    expect(error instanceof UnauthorizedError).toBe(true);
  });

  it("should create ForbiddenError with the correct status code and default message", () => {
    const error = new ForbiddenError();
    expect(error.message).toBe("Access forbidden");
    expect(error.status).toBe(403);
    expect(error instanceof AppError).toBe(true);
    expect(error instanceof ForbiddenError).toBe(true);
  });

  it("should create NotFoundError with the correct status code and default message", () => {
    const error = new NotFoundError();
    expect(error.message).toBe("Resource not found");
    expect(error.status).toBe(404);
    expect(error instanceof AppError).toBe(true);
    expect(error instanceof NotFoundError).toBe(true);
  });
});

describe("asyncHandler", () => {
  it("should wrap an async function and pass through request, response, and next", async () => {
    const mockReq = {} as Request;
    const mockRes = {} as Response;
    const mockNext = jest.fn() as NextFunction;

    const asyncFn = jest.fn().mockResolvedValue("result");
    const wrappedFn = asyncHandler(asyncFn);

    await wrappedFn(mockReq, mockRes, mockNext);

    expect(asyncFn).toHaveBeenCalledWith(mockReq, mockRes, mockNext);
    expect(mockNext).not.toHaveBeenCalled();
  });

  it("should catch errors and pass them to next", async () => {
    const mockReq = {} as Request;
    const mockRes = {} as Response;
    const mockNext = jest.fn();
    const testError = new Error("Test error");

    const asyncFn = jest.fn().mockRejectedValue(testError);
    const wrappedFn = asyncHandler(asyncFn);

    await wrappedFn(mockReq, mockRes, mockNext);

    expect(asyncFn).toHaveBeenCalledWith(mockReq, mockRes, mockNext);
    expect(mockNext).toHaveBeenCalledWith(testError);
  });

  it("should propagate custom error types to next", async () => {
    const mockReq = {} as Request;
    const mockRes = {} as Response;
    const mockNext = jest.fn();
    const customError = new NotFoundError("Entity not found");

    const asyncFn = jest.fn().mockRejectedValue(customError);
    const wrappedFn = asyncHandler(asyncFn);

    await wrappedFn(mockReq, mockRes, mockNext);

    expect(mockNext).toHaveBeenCalledWith(customError);
    expect(mockNext.mock.calls[0][0].status).toBe(404);
    expect(mockNext.mock.calls[0][0].message).toBe("Entity not found");
  });

  it("should handle non-async functions correctly", async () => {
    const mockReq = {} as Request;
    const mockRes = {} as Response;
    const mockNext = jest.fn();

    // A synchronous function that returns a value
    const syncFn = jest.fn().mockReturnValue("sync result");
    const wrappedSyncFn = asyncHandler(syncFn);

    await wrappedSyncFn(mockReq, mockRes, mockNext);

    expect(syncFn).toHaveBeenCalledWith(mockReq, mockRes, mockNext);
    expect(mockNext).not.toHaveBeenCalled();
  });
});
