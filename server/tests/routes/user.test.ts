import request from "supertest";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import app from "../../server";
import User from "../../models/users";

// Mock dependencies
jest.mock("../../models/users");
jest.mock("jsonwebtoken");

describe("User Routes", () => {
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

    // Mock User.findById with proper implementation
    (User.findById as jest.Mock).mockImplementation(() => ({
      _id: mockUserId,
      username: "testuser",
      email: "test@example.com",
      role: "user",
      select: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValue({
        _id: mockUserId,
        username: "testuser",
        email: "test@example.com",
        role: "user",
      }),
    }));
  });

  afterAll(async () => {
    // Close mongoose connection after all tests
    await mongoose.connection.close();
  });

  describe("PUT /user/profile", () => {
    it("should update user profile when authenticated", async () => {
      // Prepare test data
      const updateData = {
        username: "updateduser",
        email: "updated@example.com",
        bio: "Updated bio information",
        website: "https://example.com",
      };

      const updatedUser = {
        id: mockUserId.toString(),
        username: updateData.username,
        email: updateData.email,
        role: "user",
        bio: updateData.bio,
        website: updateData.website,
      };

      // Setup mock
      (User.updateProfile as jest.Mock).mockResolvedValue(updatedUser);

      // Execute test
      const response = await request(app)
        .put("/user/profile")
        .set("Authorization", `Bearer ${mockToken}`)
        .send(updateData)
        .expect(200);

      // Assertions
      expect(User.updateProfile).toHaveBeenCalledWith(mockUserId, updateData);
      expect(response.body).toEqual({ user: updatedUser });
    });

    it("should return 401 when not authenticated", async () => {
      // Mock that User.findById returns null for authentication failure
      (User.findById as jest.Mock).mockImplementation(() => ({
        select: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(null),
      }));

      const updateData = {
        username: "updateduser",
        email: "updated@example.com",
      };

      await request(app).put("/user/profile").send(updateData).expect(401);
    });

    it("should return 400 when username is already taken", async () => {
      const updateData = {
        username: "existinguser",
        email: "test@example.com",
      };

      // Setup mock to throw error for duplicate username
      (User.updateProfile as jest.Mock).mockRejectedValue(
        new Error("Username is already taken")
      );

      await request(app)
        .put("/user/profile")
        .set("Authorization", `Bearer ${mockToken}`)
        .send(updateData)
        .expect(400);
    });

    it("should return 400 when email is already registered", async () => {
      const updateData = {
        username: "testuser",
        email: "existing@example.com",
      };

      // Setup mock to throw error for duplicate email
      (User.updateProfile as jest.Mock).mockRejectedValue(
        new Error("Email is already registered")
      );

      await request(app)
        .put("/user/profile")
        .set("Authorization", `Bearer ${mockToken}`)
        .send(updateData)
        .expect(400);
    });

    it("should return 400 when no fields to update", async () => {
      const emptyUpdateData = {};

      await request(app)
        .put("/user/profile")
        .set("Authorization", `Bearer ${mockToken}`)
        .send(emptyUpdateData)
        .expect(400);
    });

    it("should sanitize invalid input", async () => {
      const invalidData = {
        username: "invalid username with spaces",
        email: "invalid-email",
        website: "not-a-valid-url",
      };

      await request(app)
        .put("/user/profile")
        .set("Authorization", `Bearer ${mockToken}`)
        .send(invalidData)
        .expect(400);
    });
  });

  describe("PUT /user/changePassword", () => {
    it("should change password when authenticated with correct current password", async () => {
      const passwordData = {
        currentPassword: "currentpass123",
        newPassword: "newpass123",
      };

      // Setup mock
      (User.changePassword as jest.Mock).mockResolvedValue(true);

      // Execute test
      const response = await request(app)
        .put("/user/changePassword")
        .set("Authorization", `Bearer ${mockToken}`)
        .send(passwordData)
        .expect(200);

      // Assertions
      expect(User.changePassword).toHaveBeenCalledWith(
        mockUserId,
        passwordData.currentPassword,
        passwordData.newPassword
      );
      expect(response.body).toEqual({
        message: "Password updated successfully",
      });
    });

    it("should return 401 when not authenticated", async () => {
      // Mock that User.findById returns null for authentication failure
      (User.findById as jest.Mock).mockImplementation(() => ({
        select: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(null),
      }));

      const passwordData = {
        currentPassword: "currentpass123",
        newPassword: "newpass123",
      };

      await request(app)
        .put("/user/changePassword")
        .send(passwordData)
        .expect(401);
    });

    it("should return 400 when current password is incorrect", async () => {
      const passwordData = {
        currentPassword: "wrongpass123",
        newPassword: "newpass123",
      };

      // Setup mock to throw error for incorrect password
      (User.changePassword as jest.Mock).mockRejectedValue(
        new Error("Current password is incorrect")
      );

      await request(app)
        .put("/user/changePassword")
        .set("Authorization", `Bearer ${mockToken}`)
        .send(passwordData)
        .expect(400);
    });

    it("should return 400 when password fields are missing", async () => {
      const incompleteData = {
        // Missing current password
        newPassword: "newpass123",
      };

      // Setup mock to throw error for missing fields
      (User.changePassword as jest.Mock).mockRejectedValue(
        new Error("Current password and new password are required")
      );

      await request(app)
        .put("/user/changePassword")
        .set("Authorization", `Bearer ${mockToken}`)
        .send(incompleteData)
        .expect(400);
    });

    it("should return 400 when new password format is invalid", async () => {
      const invalidPasswordData = {
        currentPassword: "currentpass123",
        newPassword: "weak", // Too short, doesn't meet requirements
      };

      await request(app)
        .put("/user/changePassword")
        .set("Authorization", `Bearer ${mockToken}`)
        .send(invalidPasswordData)
        .expect(400);
    });
  });

  describe("DELETE /user/account", () => {
    it("should delete user account when authenticated", async () => {
      // Setup mock
      (User.deleteUser as jest.Mock).mockResolvedValue({
        _id: mockUserId,
        username: "testuser",
        email: "test@example.com",
      });

      // Execute test
      const response = await request(app)
        .delete("/user/account")
        .set("Authorization", `Bearer ${mockToken}`)
        .expect(200);

      // Assertions
      expect(User.deleteUser).toHaveBeenCalledWith(mockUserId);
      expect(response.body).toEqual({
        message: "Account deleted successfully",
      });
    });

    it("should return 401 when not authenticated", async () => {
      // Mock that User.findById returns null for authentication failure
      (User.findById as jest.Mock).mockImplementation(() => ({
        select: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(null),
      }));

      await request(app).delete("/user/account").expect(401);
    });

    it("should return 404 when user is not found for deletion", async () => {
      // Setup mock to throw error for user not found
      (User.deleteUser as jest.Mock).mockRejectedValue(
        new Error("User not found")
      );

      await request(app)
        .delete("/user/account")
        .set("Authorization", `Bearer ${mockToken}`)
        .expect(404);
    });
  });
});
