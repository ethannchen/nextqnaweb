import { Request, Response, NextFunction } from "express";
import { getLogs, clearLogs } from "../../controllers/logController";
import { loggerService } from "../../utils/loggerService";
import { LogEntry } from "../../types/types";

// Mock express-async-handler
// eslint-disable-next-line @typescript-eslint/no-explicit-any
jest.mock("express-async-handler", () => (fn: any) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      return await fn(req, res, next);
    } catch (error) {
      return next(error);
    }
  };
});

// Mock the loggerService
jest.mock("../../utils/loggerService", () => ({
  loggerService: {
    getLogs: jest.fn(),
    clearLogs: jest.fn(),
  },
}));

describe("Log Controller", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: jest.MockedFunction<NextFunction>;
  let mockLogs: LogEntry[];

  beforeEach(() => {
    // Mock response object with json function
    res = {
      json: jest.fn().mockReturnThis(),
    };

    // Set up next function
    next = jest.fn();

    // Reset request object
    req = {};

    // Create mock logs data
    mockLogs = [
      {
        timestamp: new Date("2023-01-01T00:00:00Z"),
        method: "GET",
        path: "/api/test",
        ip: "127.0.0.1",
        statusCode: 200,
        responseTime: 150,
      },
      {
        timestamp: new Date("2023-01-01T00:01:00Z"),
        method: "POST",
        path: "/api/users",
        ip: "127.0.0.1",
        userId: "user123",
        statusCode: 201,
        responseTime: 220,
        userAgent: "Mozilla/5.0",
      },
    ];

    // Reset all mocks
    jest.clearAllMocks();
  });

  describe("getLogs function", () => {
    it("should return all logs when no limit is provided", async () => {
      // Setup
      req.query = {};
      (loggerService.getLogs as jest.Mock).mockReturnValue(mockLogs);

      // Execute
      await getLogs(req as Request, res as Response, next);

      // Assert
      expect(loggerService.getLogs).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({
        count: 2,
        logs: mockLogs,
      });
      expect(next).not.toHaveBeenCalled();
    });

    it("should return limited logs when limit is provided", async () => {
      // Setup
      req.query = { limit: "1" };
      (loggerService.getLogs as jest.Mock).mockReturnValue(mockLogs);

      // Execute
      await getLogs(req as Request, res as Response, next);

      // Assert
      expect(loggerService.getLogs).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({
        count: 1,
        logs: [mockLogs[0]], // Only the first log should be returned
      });
      expect(next).not.toHaveBeenCalled();
    });

    it("should handle string limit parameter correctly", async () => {
      // Setup
      req.query = { limit: "abc" }; // Non-numeric limit
      (loggerService.getLogs as jest.Mock).mockReturnValue(mockLogs);

      // Execute
      await getLogs(req as Request, res as Response, next);

      // Assert
      expect(loggerService.getLogs).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({
        count: 2,
        logs: mockLogs, // All logs should be returned since limit is NaN
      });
      expect(next).not.toHaveBeenCalled();
    });

    it("should handle errors and pass them to next", async () => {
      // Setup
      req.query = {};
      const error = new Error("Test error");
      (loggerService.getLogs as jest.Mock).mockImplementation(() => {
        throw error;
      });

      // Execute
      await getLogs(req as Request, res as Response, next);

      // Assert
      expect(loggerService.getLogs).toHaveBeenCalled();
      expect(next).toHaveBeenCalledWith(error);
      expect(res.json).not.toHaveBeenCalled();
    });
  });

  describe("clearLogs function", () => {
    it("should clear all logs and return success message", async () => {
      // Execute
      await clearLogs(req as Request, res as Response, next);

      // Assert
      expect(loggerService.clearLogs).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({
        message: "All logs have been cleared",
      });
      expect(next).not.toHaveBeenCalled();
    });

    it("should handle errors and pass them to next", async () => {
      // Setup
      const error = new Error("Test error");
      (loggerService.clearLogs as jest.Mock).mockImplementation(() => {
        throw error;
      });

      // Execute
      await clearLogs(req as Request, res as Response, next);

      // Assert
      expect(loggerService.clearLogs).toHaveBeenCalled();
      expect(next).toHaveBeenCalledWith(error);
      expect(res.json).not.toHaveBeenCalled();
    });
  });
});
