import express, { Application } from "express";
import request from "supertest";
import authRoutes from "../../routes/auth";
import { login, signup } from "../../controllers/authController";
import { sanitizeInputMiddleware } from "../../middlewares/sanitizeInputMiddleware";
import { authLimiter } from "../../middlewares/rateLimitMiddleware";

// Mock the controller functions and middleware
jest.mock("../../controllers/authController", () => ({
  signup: jest.fn((req, res) => {
    res.status(201).json({ message: "User registered successfully" });
  }),
  login: jest.fn((req, res) => {
    res.status(200).json({
      token: "test-token",
      user: {
        id: "user123",
        username: "testuser",
        email: "test@example.com",
        role: "user",
      },
    });
  }),
}));

// Mock the middleware functions
jest.mock("../../middlewares/sanitizeInputMiddleware", () => ({
  sanitizeInputMiddleware: jest.fn((req, res, next) => next()),
}));

jest.mock("../../middlewares/rateLimitMiddleware", () => ({
  authLimiter: jest.fn((req, res, next) => next()),
}));

describe("Auth Routes", () => {
  let app: Application;

  beforeEach(() => {
    // Create a fresh express app for each test
    app = express();

    // Parse JSON request bodies
    app.use(express.json());

    // Mount the router at the appropriate path
    app.use("/auth", authRoutes);

    // Clear all mocks
    jest.clearAllMocks();
  });

  describe("POST /auth/signup", () => {
    test("should route to signup controller with sanitization and rate limiting", async () => {
      // Setup mock request body
      const userData = {
        username: "newuser",
        email: "new@example.com",
        password: "Password123",
      };

      // Make a request to the endpoint
      const response = await request(app).post("/auth/signup").send(userData);

      // Verify the response
      expect(response.status).toBe(201);
      expect(response.body).toEqual({
        message: "User registered successfully",
      });

      // Verify middleware and controller were called
      expect(authLimiter).toHaveBeenCalledTimes(1);
      expect(sanitizeInputMiddleware).toHaveBeenCalledTimes(1);
      expect(signup).toHaveBeenCalledTimes(1);

      // Verify controller received the correct data
      const requestPassedToController = (signup as jest.Mock).mock.calls[0][0];
      expect(requestPassedToController.body).toEqual(userData);
    });
  });

  describe("POST /auth/login", () => {
    test("should route to login controller with sanitization and rate limiting", async () => {
      // Setup mock request body
      const loginData = {
        email: "test@example.com",
        password: "Password123",
      };

      // Make a request to the endpoint
      const response = await request(app).post("/auth/login").send(loginData);

      // Verify the response
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        token: "test-token",
        user: {
          id: "user123",
          username: "testuser",
          email: "test@example.com",
          role: "user",
        },
      });

      // Verify middleware and controller were called
      expect(authLimiter).toHaveBeenCalledTimes(1);
      expect(sanitizeInputMiddleware).toHaveBeenCalledTimes(1);
      expect(login).toHaveBeenCalledTimes(1);

      // Verify controller received the correct data
      const requestPassedToController = (login as jest.Mock).mock.calls[0][0];
      expect(requestPassedToController.body).toEqual(loginData);
    });
  });
});
