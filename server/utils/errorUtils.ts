/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Custom error utility classes that extend the native Error class
 * These provide consistent status codes and structured error responses
 * for API error handling
 */

/**
 * Base custom error class with status code and additional data
 * @class AppError
 * @extends Error
 */
export class AppError extends Error {
  status: number;
  data?: any;

  /**
   * Creates a new AppError instance
   * @param {string} message - The error message
   * @param {number} status - The HTTP status code (defaults to 500)
   * @param {any} data - Optional additional data to include in the error response
   */
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
 * Error class for 400 Bad Request responses
 * @class BadRequestError
 * @extends AppError
 */
export class BadRequestError extends AppError {
  /**
   * Creates a new BadRequestError instance
   * @param {string} message - The error message (defaults to "Bad request")
   * @param {any} data - Optional additional data to include in the error response
   */
  constructor(message: string = "Bad request", data?: any) {
    super(message, 400, data);
    // This is crucial for instanceof to work correctly
    Object.setPrototypeOf(this, BadRequestError.prototype);
  }
}

/**
 * Error class for 401 Unauthorized responses
 * @class UnauthorizedError
 * @extends AppError
 */
export class UnauthorizedError extends AppError {
  /**
   * Creates a new UnauthorizedError instance
   * @param {string} message - The error message (defaults to "Unauthorized access")
   * @param {any} data - Optional additional data to include in the error response
   */
  constructor(message: string = "Unauthorized access", data?: any) {
    super(message, 401, data);
    // This is crucial for instanceof to work correctly
    Object.setPrototypeOf(this, UnauthorizedError.prototype);
  }
}

/**
 * Error class for 403 Forbidden responses
 * @class ForbiddenError
 * @extends AppError
 */
export class ForbiddenError extends AppError {
  /**
   * Creates a new ForbiddenError instance
   * @param {string} message - The error message (defaults to "Access forbidden")
   * @param {any} data - Optional additional data to include in the error response
   */
  constructor(message: string = "Access forbidden", data?: any) {
    super(message, 403, data);
    // This is crucial for instanceof to work correctly
    Object.setPrototypeOf(this, ForbiddenError.prototype);
  }
}

/**
 * Error class for 404 Not Found responses
 * @class NotFoundError
 * @extends AppError
 */
export class NotFoundError extends AppError {
  /**
   * Creates a new NotFoundError instance
   * @param {string} message - The error message (defaults to "Resource not found")
   * @param {any} data - Optional additional data to include in the error response
   */
  constructor(message: string = "Resource not found", data?: any) {
    super(message, 404, data);
    // This is crucial for instanceof to work correctly
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}
