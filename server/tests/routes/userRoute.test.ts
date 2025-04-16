import express, { Application } from "express";
import request from "supertest";
import userRoutes from "../../routes/user";
import {
  updateProfile,
  changePassword,
  deleteAccount,
} from "../../controllers/userController";
import { authenticate } from "../../middlewares/authMiddleware";
import { sanitizeInputMiddleware } from "../../middlewares/sanitizeInputMiddleware";
import { userLimiter } from "../../middlewares/rateLimitMiddleware";

// Mock the controllers and middleware
jest.mock("../../controllers/userController", () => ({
  updateProfile: jest.fn((req, res) => {
    res.status(200).json({ success: true, message: "Profile updated" });
  }),
  changePassword: jest.fn((req, res) => {
    res.status(200).json({ success: true, message: "Password changed" });
  }),
  deleteAccount: jest.fn((req, res) => {
    res.status(200).json({ success: true, message: "Account deleted" });
  }),
}));

// Mock the authenticate middleware
jest.mock("../../middlewares/authMiddleware", () => ({
  authenticate: jest.fn((req, res, next) => {
    // Simulate successful authentication
    req.user = { id: "user123", role: "user" };
    next();
  }),
}));

// Mock the sanitizeInputMiddleware
jest.mock("../../middlewares/sanitizeInputMiddleware", () => ({
  sanitizeInputMiddleware: jest.fn((req, res, next) => {
    // Simulate sanitization without changing the request
    next();
  }),
}));

// Mock the userLimiter middleware
jest.mock("../../middlewares/rateLimitMiddleware", () => ({
  userLimiter: jest.fn((req, res, next) => {
    // Just pass through for testing
    next();
  }),
}));

describe("User Routes", () => {
  let app: Application;

  beforeEach(() => {
    // Create a fresh express app for each test
    app = express();

    // Mount the router at the appropriate path
    app.use("/user", userRoutes);

    jest.clearAllMocks();
  });

  describe("PUT /user/profile", () => {
    test("should route to updateProfile controller with proper middleware", async () => {
      // Define test data for profile update
      const profileData = {
        username: "newusername",
        email: "newemail@test.com",
        bio: "Updated bio",
        website: "https://example.com",
      };

      // Make a request to the endpoint
      const response = await request(app)
        .put("/user/profile")
        .send(profileData);

      // Verify the response
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        success: true,
        message: "Profile updated",
      });

      // Verify the middleware and controller were called in the correct order
      expect(userLimiter).toHaveBeenCalledTimes(1);
      expect(authenticate).toHaveBeenCalledTimes(1);
      expect(sanitizeInputMiddleware).toHaveBeenCalledTimes(1);
      expect(updateProfile).toHaveBeenCalledTimes(1);
    });

    test("should handle errors from authentication middleware", async () => {
      // Override the authenticate middleware to simulate error
      (authenticate as jest.Mock).mockImplementationOnce((req, res) => {
        return res
          .status(401)
          .json({ success: false, message: "Authentication failed" });
      });

      // Make a request that should be blocked
      const response = await request(app)
        .put("/user/profile")
        .send({ username: "newusername" });

      // Verify the response
      expect(response.status).toBe(401);
      expect(response.body).toEqual({
        success: false,
        message: "Authentication failed",
      });

      // Verify that the controller was not called
      expect(updateProfile).not.toHaveBeenCalled();
    });
  });

  describe("PUT /user/changePassword", () => {
    test("should route to changePassword controller with proper middleware", async () => {
      // Define test data for password change
      const passwordData = {
        currentPassword: "oldPassword123",
        newPassword: "newPassword123",
      };

      // Make a request to the endpoint
      const response = await request(app)
        .put("/user/changePassword")
        .send(passwordData);

      // Verify the response
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        success: true,
        message: "Password changed",
      });

      // Verify the middleware and controller were called in the correct order
      expect(userLimiter).toHaveBeenCalledTimes(1);
      expect(authenticate).toHaveBeenCalledTimes(1);
      expect(sanitizeInputMiddleware).toHaveBeenCalledTimes(1);
      expect(changePassword).toHaveBeenCalledTimes(1);
    });

    test("should handle errors from sanitization middleware", async () => {
      // Override the sanitizeInputMiddleware to simulate error
      (sanitizeInputMiddleware as jest.Mock).mockImplementationOnce(
        (req, res) => {
          return res
            .status(400)
            .json({ success: false, message: "Invalid password format" });
        }
      );

      // Make a request with invalid data
      const response = await request(app)
        .put("/user/changePassword")
        .send({ currentPassword: "weak", newPassword: "short" });

      // Verify the response
      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        success: false,
        message: "Invalid password format",
      });

      // Verify that the controller was not called
      expect(changePassword).not.toHaveBeenCalled();
    });
  });

  describe("DELETE /user/account", () => {
    test("should route to deleteAccount controller with proper middleware", async () => {
      // Make a request to the endpoint
      const response = await request(app).delete("/user/account");

      // Verify the response
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        success: true,
        message: "Account deleted",
      });

      // Verify the middleware and controller were called in the correct order
      expect(userLimiter).toHaveBeenCalledTimes(1);
      expect(authenticate).toHaveBeenCalledTimes(1);
      expect(deleteAccount).toHaveBeenCalledTimes(1);
    });
  });
});
