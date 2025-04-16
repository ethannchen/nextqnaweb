import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import {
  updateProfile,
  changePassword,
  deleteAccount,
} from "../../controllers/userController";
import User from "../../models/users";
import {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
} from "../../utils/errorUtils";

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

// Mock the User model
jest.mock("../../models/users");

describe("User Controller", () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: jest.Mock;

  beforeEach(() => {
    mockRequest = {
      user: {
        id: new mongoose.Types.ObjectId(),
        role: "user",
      },
      body: {},
    };
    mockResponse = {
      json: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis(),
    };
    mockNext = jest.fn();

    jest.clearAllMocks();
  });

  describe("updateProfile", () => {
    it("should update a user's profile successfully", async () => {
      // Setup
      mockRequest.body = {
        username: "newUsername",
        email: "new@example.com",
        bio: "New bio",
        website: "https://example.com",
      };

      const updatedUser = {
        username: "newUsername",
        email: "new@example.com",
        bio: "New bio",
        website: "https://example.com",
      };

      (User.updateProfile as jest.Mock).mockResolvedValue(updatedUser);

      // Execute
      await updateProfile(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // Verify
      expect(User.updateProfile).toHaveBeenCalledWith(mockRequest.user?.id, {
        username: "newUsername",
        email: "new@example.com",
        bio: "New bio",
        website: "https://example.com",
      });
      expect(mockResponse.json).toHaveBeenCalledWith({ user: updatedUser });
    });

    it("should throw UnauthorizedError if user is not authenticated", async () => {
      // Setup
      mockRequest.user = undefined;
      mockRequest.body = { username: "newUsername" };

      // Execute
      await updateProfile(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // Verify
      expect(mockNext).toHaveBeenCalledWith(expect.any(UnauthorizedError));
      expect(User.updateProfile).not.toHaveBeenCalled();
    });

    it("should throw BadRequestError if no fields are provided to update", async () => {
      // Setup
      mockRequest.body = {};

      // Execute
      await updateProfile(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // Verify
      expect(mockNext).toHaveBeenCalledWith(expect.any(BadRequestError));
      expect(User.updateProfile).not.toHaveBeenCalled();
    });

    it("should handle NotFoundError from User.updateProfile", async () => {
      // Setup
      mockRequest.body = { username: "newUsername" };
      const error = new Error("User not found");
      (User.updateProfile as jest.Mock).mockRejectedValue(error);

      // Execute
      await updateProfile(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // Verify
      expect(mockNext).toHaveBeenCalledWith(expect.any(NotFoundError));
    });

    it("should handle 'Username is already taken' error", async () => {
      // Setup
      mockRequest.body = { username: "takenUsername" };
      const error = new Error("Username is already taken");
      (User.updateProfile as jest.Mock).mockRejectedValue(error);

      // Execute
      await updateProfile(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // Verify
      expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
    });

    it("should handle 'Email is already registered' error", async () => {
      // Setup
      mockRequest.body = { email: "taken@example.com" };
      const error = new Error("Email is already registered");
      (User.updateProfile as jest.Mock).mockRejectedValue(error);

      // Execute
      await updateProfile(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // Verify
      expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
    });

    it("should handle other errors", async () => {
      // Setup
      mockRequest.body = { username: "newUsername" };
      const error = new Error("Unexpected error");
      (User.updateProfile as jest.Mock).mockRejectedValue(error);

      // Execute
      await updateProfile(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // Verify
      expect(mockNext).toHaveBeenCalledWith(error);
    });

    it("should update only bio if only bio is provided", async () => {
      // Setup
      mockRequest.body = { bio: "New bio" };
      const updatedUser = { bio: "New bio" };
      (User.updateProfile as jest.Mock).mockResolvedValue(updatedUser);

      // Execute
      await updateProfile(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // Verify
      expect(User.updateProfile).toHaveBeenCalledWith(mockRequest.user?.id, {
        bio: "New bio",
      });
      expect(mockResponse.json).toHaveBeenCalledWith({ user: updatedUser });
    });

    it("should update only website if only website is provided", async () => {
      // Setup
      mockRequest.body = { website: "https://example.com" };
      const updatedUser = { website: "https://example.com" };
      (User.updateProfile as jest.Mock).mockResolvedValue(updatedUser);

      // Execute
      await updateProfile(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // Verify
      expect(User.updateProfile).toHaveBeenCalledWith(mockRequest.user?.id, {
        website: "https://example.com",
      });
      expect(mockResponse.json).toHaveBeenCalledWith({ user: updatedUser });
    });
  });

  describe("changePassword", () => {
    it("should change password successfully", async () => {
      // Setup
      mockRequest.body = {
        currentPassword: "oldPassword",
        newPassword: "newPassword",
      };
      (User.changePassword as jest.Mock).mockResolvedValue(true);

      // Execute
      await changePassword(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // Verify
      expect(User.changePassword).toHaveBeenCalledWith(
        mockRequest.user?.id,
        "oldPassword",
        "newPassword"
      );
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: "Password updated successfully",
      });
    });

    it("should throw UnauthorizedError if user is not authenticated", async () => {
      // Setup
      mockRequest.user = undefined;
      mockRequest.body = {
        currentPassword: "oldPassword",
        newPassword: "newPassword",
      };

      // Execute
      await changePassword(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // Verify
      expect(mockNext).toHaveBeenCalledWith(expect.any(UnauthorizedError));
      expect(User.changePassword).not.toHaveBeenCalled();
    });

    it("should handle 'User not found' error", async () => {
      // Setup
      mockRequest.body = {
        currentPassword: "oldPassword",
        newPassword: "newPassword",
      };
      const error = new Error("User not found");
      (User.changePassword as jest.Mock).mockRejectedValue(error);

      // Execute
      await changePassword(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // Verify
      expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
    });

    it("should handle 'Current password is incorrect' error", async () => {
      // Setup
      mockRequest.body = {
        currentPassword: "wrongPassword",
        newPassword: "newPassword",
      };
      const error = new Error("Current password is incorrect");
      (User.changePassword as jest.Mock).mockRejectedValue(error);

      // Execute
      await changePassword(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // Verify
      expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
    });

    it("should handle 'Current password and new password are required' error", async () => {
      // Setup
      mockRequest.body = {};
      const error = new Error("Current password and new password are required");
      (User.changePassword as jest.Mock).mockRejectedValue(error);

      // Execute
      await changePassword(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // Verify
      expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
    });

    it("should handle other errors", async () => {
      // Setup
      mockRequest.body = {
        currentPassword: "oldPassword",
        newPassword: "newPassword",
      };
      const error = new Error("Unexpected error");
      (User.changePassword as jest.Mock).mockRejectedValue(error);

      // Execute
      await changePassword(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // Verify
      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe("deleteAccount", () => {
    it("should delete account successfully", async () => {
      // Setup
      const deletedUser = { username: "deletedUser" };
      (User.deleteUser as jest.Mock).mockResolvedValue(deletedUser);

      // Execute
      await deleteAccount(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // Verify
      expect(User.deleteUser).toHaveBeenCalledWith(mockRequest.user?.id);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: "Account deleted successfully",
      });
    });

    it("should throw UnauthorizedError if user is not authenticated", async () => {
      // Setup
      mockRequest.user = undefined;

      // Execute
      await deleteAccount(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // Verify
      expect(mockNext).toHaveBeenCalledWith(expect.any(UnauthorizedError));
      expect(User.deleteUser).not.toHaveBeenCalled();
    });

    it("should handle 'User not found' error", async () => {
      // Setup
      const error = new Error("User not found");
      (User.deleteUser as jest.Mock).mockRejectedValue(error);

      // Execute
      await deleteAccount(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // Verify
      expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
    });

    it("should handle other errors", async () => {
      // Setup
      const error = new Error("Unexpected error");
      (User.deleteUser as jest.Mock).mockRejectedValue(error);

      // Execute
      await deleteAccount(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // Verify
      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });
});
