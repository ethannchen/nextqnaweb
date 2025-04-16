/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  AppError,
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
} from "../../utils/errorUtils";

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
