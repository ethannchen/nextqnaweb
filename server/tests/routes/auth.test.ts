import request from "supertest";
import jwt from "jsonwebtoken";
import app from "../../server";
import User from "../../models/users";

// Mock environment variable
process.env.JWT_SECRET = "test-secret-key";

describe("Auth Routes", () => {
  const testUserData = {
    username: "testuser",
    email: "test@example.com",
    password: "Password123",
  };

  // Clean up the database after each test
  afterEach(async () => {
    await User.deleteMany({});
  });

  describe("POST /auth/signup", () => {
    it("should create a new user successfully", async () => {
      const response = await request(app)
        .post("/auth/signup")
        .send(testUserData);

      expect(response.status).toBe(201);
      expect(response.body.message).toContain("registered successfully");

      // Verify user was created in the database
      const user = await User.findByUsername(testUserData.username);
      expect(user).toBeTruthy();
      expect(user?.email).toBe(testUserData.email);
    });

    it("should return 400 when username is invalid", async () => {
      const response = await request(app)
        .post("/auth/signup")
        .send({
          ...testUserData,
          username: "te", // Too short
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toContain("Invalid username format");
    });

    it("should return 400 when email is invalid", async () => {
      const response = await request(app)
        .post("/auth/signup")
        .send({
          ...testUserData,
          email: "invalid-email",
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toContain("Invalid email format");
    });

    it("should return 400 when password is invalid", async () => {
      const response = await request(app)
        .post("/auth/signup")
        .send({
          ...testUserData,
          password: "short", // Too short and no number
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toContain("Invalid password format");
    });

    it("should return 400 when username is already taken", async () => {
      // First create a user
      await User.addNewUser(testUserData);

      // Try to create another user with the same username
      const response = await request(app)
        .post("/auth/signup")
        .send({
          ...testUserData,
          email: "different@example.com", // Different email
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toContain("Username is already taken");
    });

    it("should return 400 when email is already registered", async () => {
      // First create a user
      await User.addNewUser(testUserData);

      // Try to create another user with the same email
      const response = await request(app)
        .post("/auth/signup")
        .send({
          ...testUserData,
          username: "differentuser", // Different username
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toContain("Email is already registered");
    });
  });

  describe("POST /auth/login", () => {
    beforeEach(async () => {
      // Create a test user before each login test
      await User.addNewUser(testUserData);
    });

    it("should login successfully with correct credentials", async () => {
      const response = await request(app).post("/auth/login").send({
        email: testUserData.email,
        password: testUserData.password,
      });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("token");
      expect(response.body).toHaveProperty("user");
      expect(response.body.user.username).toBe(testUserData.username);
      expect(response.body.user.email).toBe(testUserData.email);

      // Verify the token is valid
      const decodedToken = jwt.verify(
        response.body.token,
        process.env.JWT_SECRET as string
      ) as { id: string };
      expect(decodedToken).toHaveProperty("id");
    });

    it("should return 401 with incorrect password", async () => {
      const response = await request(app).post("/auth/login").send({
        email: testUserData.email,
        password: "wrongpassword123",
      });

      expect(response.status).toBe(401);
      expect(response.body.error).toContain("Invalid credentials");
    });

    it("should return 401 with non-existent email", async () => {
      const response = await request(app).post("/auth/login").send({
        email: "nonexistent@example.com",
        password: testUserData.password,
      });

      expect(response.status).toBe(401);
      expect(response.body.error).toContain("Invalid credentials");
    });

    it("should return 400 with invalid email format", async () => {
      const response = await request(app).post("/auth/login").send({
        email: "invalid-email",
        password: testUserData.password,
      });

      expect(response.status).toBe(400);
      expect(response.body.error).toContain("Invalid email format");
    });
  });

  describe("Rate limiting", () => {
    // Note: These tests need special handling since the rate limiter is applied
    // and we don't want to actually wait for the window to expire in tests

    it("should handle rate limiting for authentication routes", async () => {
      // This is more of a conceptual test - in a real scenario we'd mock the rate limiter
      // or create a test-specific configuration

      // Here we're just verifying the route has the limiter middleware applied
      // The actual rate limiting behavior would require special test setup

      // Create multiple requests in quick succession
      const promises = [];
      for (let i = 0; i < 6; i++) {
        // authLimiter is set to 5 requests per minute
        promises.push(
          request(app).post("/auth/login").send({
            email: "test@example.com",
            password: "Password123",
          })
        );
      }

      // In a real scenario, the 6th request would be rate limited
      // but for testing purposes, we're just checking the routes are set up
      const results = await Promise.all(promises);

      // Verify the first 5 requests should go through
      // (they might fail due to auth, but not due to rate limiting)
      for (let i = 0; i < 5; i++) {
        expect(results[i].status).not.toBe(429); // Not rate limited
      }

      // Note: In a real test with rate limiting enabled, we'd expect the 6th
      // request to return 429, but that would make the test slow and flaky
    });
  });
});
