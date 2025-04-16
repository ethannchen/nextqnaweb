// Mocking dependencies
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../../models/users";
import { BadRequestError, UnauthorizedError } from "../../utils/errorUtils";
import { login, signup } from "../../controllers/authController";

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

// Mock the jwt module
jest.mock("jsonwebtoken");

// Mock the User model
jest.mock("../../models/users", () => ({
  addNewUser: jest.fn(),
  findByEmail: jest.fn(),
}));

describe("Auth Controller", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: jest.Mock;

  beforeEach(() => {
    req = {
      body: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    next = jest.fn();
    jest.clearAllMocks();
  });

  describe("signup", () => {
    it("should register a new user successfully", async () => {
      // Arrange
      req.body = {
        username: "testuser",
        email: "test@example.com",
        password: "Test123!",
        role: "user",
      };

      const mockUser = {
        _id: "user123",
        username: "testuser",
        email: "test@example.com",
        role: "user",
      };

      (User.addNewUser as jest.Mock).mockResolvedValue(mockUser);

      // Act
      await signup(req as Request, res as Response, next);

      // Assert
      expect(User.addNewUser).toHaveBeenCalledWith({
        username: "testuser",
        email: "test@example.com",
        password: "Test123!",
        role: "user",
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: "User testuser registered successfully",
      });
      expect(next).not.toHaveBeenCalled();
    });

    it("should handle email already registered error", async () => {
      // Arrange
      req.body = {
        username: "testuser",
        email: "test@example.com",
        password: "Test123!",
      };

      (User.addNewUser as jest.Mock).mockRejectedValue(
        new Error("Email is already registered")
      );

      // Act
      await signup(req as Request, res as Response, next);

      // Assert
      expect(User.addNewUser).toHaveBeenCalled();
      expect(next).toHaveBeenCalledWith(expect.any(BadRequestError));
      expect(next.mock.calls[0][0].message).toBe("Email is already registered");
    });

    it("should handle username already taken error", async () => {
      // Arrange
      req.body = {
        username: "testuser",
        email: "test@example.com",
        password: "Test123!",
      };

      (User.addNewUser as jest.Mock).mockRejectedValue(
        new Error("Username is already taken")
      );

      // Act
      await signup(req as Request, res as Response, next);

      // Assert
      expect(User.addNewUser).toHaveBeenCalled();
      expect(next).toHaveBeenCalledWith(expect.any(BadRequestError));
      expect(next.mock.calls[0][0].message).toBe("Username is already taken");
    });

    it("should handle generic errors during registration", async () => {
      // Arrange
      req.body = {
        username: "testuser",
        email: "test@example.com",
        password: "Test123!",
      };

      const error = new Error("Database connection error");
      (User.addNewUser as jest.Mock).mockRejectedValue(error);

      // Act
      await signup(req as Request, res as Response, next);

      // Assert
      expect(User.addNewUser).toHaveBeenCalled();
      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe("login", () => {
    it("should login user successfully with valid credentials", async () => {
      // Arrange
      req.body = {
        email: "test@example.com",
        password: "Test123!",
      };

      const mockUser = {
        _id: "user123",
        username: "testuser",
        email: "test@example.com",
        role: "user",
        bio: "Test bio",
        website: "https://test.com",
        comparePassword: jest.fn().mockResolvedValue(true),
      };

      (User.findByEmail as jest.Mock).mockResolvedValue(mockUser);
      (jwt.sign as jest.Mock).mockReturnValue("fake-token");

      // Act
      await login(req as Request, res as Response, next);

      // Assert
      expect(User.findByEmail).toHaveBeenCalledWith("test@example.com");
      expect(mockUser.comparePassword).toHaveBeenCalledWith("Test123!");
      expect(jwt.sign).toHaveBeenCalledWith(
        { id: "user123" },
        expect.any(String),
        { expiresIn: "1d" }
      );
      expect(res.json).toHaveBeenCalledWith({
        token: "fake-token",
        user: {
          id: "user123",
          username: "testuser",
          email: "test@example.com",
          role: "user",
          bio: "Test bio",
          website: "https://test.com",
        },
      });
      expect(next).not.toHaveBeenCalled();
    });

    it("should throw error if user does not exist", async () => {
      // Arrange
      req.body = {
        email: "nonexistent@example.com",
        password: "Test123!",
      };

      (User.findByEmail as jest.Mock).mockResolvedValue(null);

      // Act
      await login(req as Request, res as Response, next);

      // Assert
      expect(User.findByEmail).toHaveBeenCalledWith("nonexistent@example.com");
      expect(next).toHaveBeenCalledWith(expect.any(UnauthorizedError));
      expect(next.mock.calls[0][0].message).toBe("Invalid credentials");
    });

    it("should throw error if password is incorrect", async () => {
      // Arrange
      req.body = {
        email: "test@example.com",
        password: "WrongPassword!",
      };

      const mockUser = {
        _id: "user123",
        email: "test@example.com",
        comparePassword: jest.fn().mockResolvedValue(false),
      };

      (User.findByEmail as jest.Mock).mockResolvedValue(mockUser);

      // Act
      await login(req as Request, res as Response, next);

      // Assert
      expect(User.findByEmail).toHaveBeenCalledWith("test@example.com");
      expect(mockUser.comparePassword).toHaveBeenCalledWith("WrongPassword!");
      expect(next).toHaveBeenCalledWith(expect.any(UnauthorizedError));
      expect(next.mock.calls[0][0].message).toBe("Invalid credentials");
    });

    it("should handle errors during login process", async () => {
      // Arrange
      req.body = {
        email: "test@example.com",
        password: "Test123!",
      };

      const error = new Error("Database error");
      (User.findByEmail as jest.Mock).mockRejectedValue(error);

      // Act
      await login(req as Request, res as Response, next);

      // Assert
      expect(User.findByEmail).toHaveBeenCalledWith("test@example.com");
      expect(next).toHaveBeenCalledWith(error);
    });
  });
});
