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
    // This is crucial for instanceof to work correctly
    Object.setPrototypeOf(this, BadRequestError.prototype);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = "Unauthorized access", data?: any) {
    super(message, 401, data);
    // This is crucial for instanceof to work correctly
    Object.setPrototypeOf(this, UnauthorizedError.prototype);
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = "Access forbidden", data?: any) {
    super(message, 403, data);
    // This is crucial for instanceof to work correctly
    Object.setPrototypeOf(this, ForbiddenError.prototype);
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = "Resource not found", data?: any) {
    super(message, 404, data);
    // This is crucial for instanceof to work correctly
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}
