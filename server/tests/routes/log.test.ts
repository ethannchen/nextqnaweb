import request from "supertest";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import app from "../../server";
import User from "../../models/users";
import { loggerService } from "../../utils/loggerService";
import { LogEntry } from "../../types/types";

// Mock dependencies
jest.mock("../../models/users");
jest.mock("../../utils/loggerService");
jest.mock("jsonwebtoken");

describe("Log Routes", () => {
  let mockToken: string;
  let mockUserId: mongoose.Types.ObjectId;

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();

    // Setup mock authentication
    mockUserId = new mongoose.Types.ObjectId();
    mockToken = "test-token";

    // Mock JWT verification
    (jwt.verify as jest.Mock).mockReturnValue({ id: mockUserId.toString() });

    // Mock User.findById with proper implementation for admin user
    (User.findById as jest.Mock).mockImplementation(() => ({
      _id: mockUserId,
      username: "adminuser",
      email: "admin@example.com",
      role: "admin",
      select: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValue({
        _id: mockUserId,
        username: "adminuser",
        email: "admin@example.com",
        role: "admin",
      }),
    }));
  });

  afterAll(async () => {
    // Close mongoose connection after all tests
    await mongoose.connection.close();
  });

  describe("GET /logs", () => {
    it("should return all logs when authenticated as admin", async () => {
      // Mock sample logs
      const sampleLogs: LogEntry[] = [
        {
          timestamp: new Date(),
          method: "GET",
          path: "/question/getQuestion",
          ip: "127.0.0.1",
          userId: "user123",
          statusCode: 200,
          responseTime: 55,
          userAgent: "Mozilla/5.0",
        },
        {
          timestamp: new Date(),
          method: "POST",
          path: "/answer/addAnswer",
          ip: "127.0.0.1",
          userId: "user456",
          statusCode: 201,
          responseTime: 128,
          userAgent: "Mozilla/5.0",
        },
      ];

      // Setup mock for loggerService
      (loggerService.getLogs as jest.Mock).mockReturnValue(sampleLogs);

      // Execute test
      const response = await request(app)
        .get("/logs")
        .set("Authorization", `Bearer ${mockToken}`)
        .expect(200);

      // Assertions
      expect(loggerService.getLogs).toHaveBeenCalled();
      expect(response.body).toEqual({
        count: sampleLogs.length,
        logs: sampleLogs,
      });
    });

    it("should return limited logs when limit parameter is provided", async () => {
      // Mock sample logs
      const sampleLogs: LogEntry[] = [
        {
          timestamp: new Date(),
          method: "GET",
          path: "/question/getQuestion",
          ip: "127.0.0.1",
          userId: "user123",
          statusCode: 200,
          responseTime: 55,
          userAgent: "Mozilla/5.0",
        },
        {
          timestamp: new Date(),
          method: "POST",
          path: "/answer/addAnswer",
          ip: "127.0.0.1",
          userId: "user456",
          statusCode: 201,
          responseTime: 128,
          userAgent: "Mozilla/5.0",
        },
        {
          timestamp: new Date(),
          method: "PUT",
          path: "/user/profile",
          ip: "127.0.0.1",
          userId: "user789",
          statusCode: 200,
          responseTime: 75,
          userAgent: "Mozilla/5.0",
        },
      ];

      // Setup mock for loggerService
      (loggerService.getLogs as jest.Mock).mockReturnValue(sampleLogs);

      // Request with limit parameter
      const limit = 2;
      const response = await request(app)
        .get(`/logs?limit=${limit}`)
        .set("Authorization", `Bearer ${mockToken}`)
        .expect(200);

      // Assertions
      expect(loggerService.getLogs).toHaveBeenCalled();
      expect(response.body.count).toBe(limit);
      expect(response.body.logs.length).toBe(limit);
      expect(response.body.logs).toEqual(sampleLogs.slice(0, limit));
    });

    it("should return 401 when not authenticated", async () => {
      // Mock that User.findById returns null for authentication failure
      (User.findById as jest.Mock).mockImplementation(() => ({
        select: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(null),
      }));

      await request(app).get("/logs").expect(401);
    });

    it("should return 403 when authenticated as non-admin user", async () => {
      // Mock User.findById with regular user (not admin)
      (User.findById as jest.Mock).mockImplementation(() => ({
        _id: mockUserId,
        username: "regularuser",
        role: "user",
        select: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue({
          _id: mockUserId,
          username: "regularuser",
          role: "user",
        }),
      }));

      await request(app)
        .get("/logs")
        .set("Authorization", `Bearer ${mockToken}`)
        .expect(403);
    });
  });

  describe("DELETE /logs", () => {
    it("should clear all logs when authenticated as admin", async () => {
      // Setup mock for loggerService
      (loggerService.clearLogs as jest.Mock).mockImplementation(
        () => undefined
      );

      // Execute test
      const response = await request(app)
        .delete("/logs")
        .set("Authorization", `Bearer ${mockToken}`)
        .expect(200);

      // Assertions
      expect(loggerService.clearLogs).toHaveBeenCalled();
      expect(response.body).toEqual({ message: "All logs have been cleared" });
    });

    it("should return 401 when not authenticated", async () => {
      // Mock that User.findById returns null for authentication failure
      (User.findById as jest.Mock).mockImplementation(() => ({
        select: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(null),
      }));

      await request(app).delete("/logs").expect(401);

      // Verify clear logs was not called
      expect(loggerService.clearLogs).not.toHaveBeenCalled();
    });

    it("should return 403 when authenticated as non-admin user", async () => {
      // Mock User.findById with regular user (not admin)
      (User.findById as jest.Mock).mockImplementation(() => ({
        _id: mockUserId,
        username: "regularuser",
        role: "user",
        select: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue({
          _id: mockUserId,
          username: "regularuser",
          role: "user",
        }),
      }));

      await request(app)
        .delete("/logs")
        .set("Authorization", `Bearer ${mockToken}`)
        .expect(403);

      // Verify clear logs was not called
      expect(loggerService.clearLogs).not.toHaveBeenCalled();
    });
  });
});
