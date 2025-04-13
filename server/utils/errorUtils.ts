/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Custom error class with status code and additional data
 */
export class AppError extends Error {
  status: number;
  data?: any;

  constructor(message: string, status: number = 500, data?: any) {
    super(message);
    this.name = this.constructor.name;
    this.status = status;
    this.data = data;

    // This is necessary for proper error instance checking in TypeScript
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

/**
 * Common HTTP error types with predefined status codes
 */
export class BadRequestError extends AppError {
  constructor(message: string = "Bad request", data?: any) {
    super(message, 400, data);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = "Unauthorized access", data?: any) {
    super(message, 401, data);
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = "Access forbidden", data?: any) {
    super(message, 403, data);
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = "Resource not found", data?: any) {
    super(message, 404, data);
  }
}

/**
 * Utility function to wrap controller functions with try/catch
 * This eliminates the need for try/catch blocks in every controller
 */
// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
export const asyncHandler = (fn: Function) => {
  return (req: any, res: any, next: any) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
