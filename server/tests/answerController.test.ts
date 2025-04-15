import { Request, Response } from "express";
import mongoose from "mongoose";
import {
  addAnswer,
  voteAnswer,
  addComment,
} from "../controllers/answerController";
import Answer from "../models/answers";
import User from "../models/users";
import { AppError } from "../utils/errorUtils";

// Mock dependencies
jest.mock("../models/answers");
jest.mock("../models/users");
jest.mock("jsonwebtoken");

describe("Answer Controller Tests", () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: jest.Mock;

  beforeEach(() => {
    mockRequest = {
      params: {},
      body: {},
      header: jest.fn(),
      user: {
        id: new mongoose.Types.ObjectId(),
        role: "user",
      },
    };

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    mockNext = jest.fn();
    jest.clearAllMocks();
  });

  describe("addAnswer", () => {
    it("should add a new answer successfully", async () => {
      // Setup mock data
      const mockQid = "question123";
      const mockAnswer = {
        text: "This is a test answer",
        ans_by: "testuser@example.com",
        ans_date_time: new Date().toISOString(),
      };

      const mockAddAnswerResponse = {
        _id: "answer123",
        ...mockAnswer,
      };

      // Setup request
      mockRequest.body = {
        qid: mockQid,
        ans: mockAnswer,
      };

      // Setup mock implementation
      (Answer.addAnswerToQuestion as jest.Mock).mockResolvedValue(
        mockAddAnswerResponse
      );

      // Call the controller
      await addAnswer(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // Assertions
      expect(Answer.addAnswerToQuestion).toHaveBeenCalledWith(
        mockQid,
        mockAnswer
      );
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockAddAnswerResponse);
    });

    it("should call next with BadRequestError when required fields are missing", async () => {
      // Setup request with missing fields
      mockRequest.body = {
        qid: "question123",
        ans: {
          // Missing text
          ans_by: "testuser@example.com",
          ans_date_time: new Date().toISOString(),
        },
      };

      // Call the controller
      await addAnswer(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // Check that next was called with an error
      expect(mockNext).toHaveBeenCalled();
      expect(mockNext.mock.calls[0][0].message).toBe("Missing required fields");

      // Ensure the model function wasn't called
      expect(Answer.addAnswerToQuestion).not.toHaveBeenCalled();
    });
  });

  describe("voteAnswer", () => {
    test("should upvote an answer when user has not voted before", async () => {
      const mockAid = "507f1f77bcf86cd799439011";
      const mockEmail = "user@example.com";

      const mockUser = {
        _id: new mongoose.Types.ObjectId(),
        email: mockEmail,
      };
      const mockAnswer = {
        _id: new mongoose.Types.ObjectId(mockAid),
        hasUserVoted: jest.fn().mockReturnValue(false),
        vote: jest.fn().mockResolvedValue(undefined),
        unvote: jest.fn(),
      };

      mockRequest.params = { aid: mockAid };
      mockRequest.body = { email: mockEmail };

      // Setup mock returns
      User.findByEmail = jest.fn().mockImplementationOnce((email) => {
        if (email == mockEmail) {
          return Promise.resolve(mockUser);
        }
        return Promise.resolve(null);
      });

      Answer.findById = jest.fn().mockImplementationOnce((aid) => {
        if (aid == mockAid) {
          return Promise.resolve(mockAnswer);
        }
        return Promise.resolve(null);
      });

      // Call the controller
      await voteAnswer(mockRequest as Request, mockResponse as Response);

      // Assertions
      expect(User.findByEmail).toHaveBeenCalledWith(mockEmail);
      expect(Answer.findById).toHaveBeenCalledWith(mockAid);
      expect(mockAnswer.hasUserVoted).toHaveBeenCalledWith(mockEmail);
      expect(mockAnswer.vote).toHaveBeenCalledWith(mockEmail);
      expect(mockAnswer.unvote).not.toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        ...mockAnswer,
        _id: mockAid,
      });
    });

    it("should toggle vote when user has already voted", async () => {
      // Setup mock data with valid ObjectId format
      const mockAid = "507f1f77bcf86cd799439011";
      const mockEmail = "user@example.com";
      const mockUser = { _id: new mongoose.Types.ObjectId(), email: mockEmail };
      const mockAnswer = {
        _id: new mongoose.Types.ObjectId(mockAid),
        text: "Test answer",
        hasUserVoted: jest.fn().mockReturnValue(true),
        vote: jest.fn().mockResolvedValue(true),
        unvote: jest.fn().mockResolvedValue(true),
      };

      // Setup request
      mockRequest.params = { aid: mockAid };
      mockRequest.body = { email: mockEmail };

      // Setup mock implementations
      (User.findByEmail as jest.Mock).mockResolvedValue(mockUser);
      (Answer.findById as jest.Mock).mockResolvedValue(mockAnswer);

      // Call the controller
      await voteAnswer(mockRequest as Request, mockResponse as Response);

      // Assertions
      expect(User.findByEmail).toHaveBeenCalledWith(mockEmail);
      expect(Answer.findById).toHaveBeenCalledWith(mockAid);
      expect(mockAnswer.hasUserVoted).toHaveBeenCalledWith(mockEmail);
      expect(mockAnswer.unvote).toHaveBeenCalledWith(mockEmail);
      expect(mockAnswer.vote).not.toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(200);
    });

    test("should throw error when email is missing", async () => {
      // Arrange
      mockRequest.body = {};

      // Act & Assert
      try {
        await voteAnswer(mockRequest as Request, mockResponse as Response);
        fail("Expected AppError was not thrown");
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        if (error instanceof AppError) {
          expect(error.message).toBe("Missing user email in request body");
        } else {
          fail("Error was not an instance of AppError");
        }
      }
    });

    test("should throw error when user is not found", async () => {
      mockRequest.body = { email: "wrong@email.com" };
      // Arrange
      (User.findByEmail as jest.Mock).mockResolvedValue(null);

      // Act & Assert
      try {
        await voteAnswer(mockRequest as Request, mockResponse as Response);
        // If we reach here, the test should fail because we expected an error
        fail("Expected BadRequestError was not thrown");
      } catch (error: unknown) {
        expect(error).toBeInstanceOf(AppError);
        if (error instanceof AppError) {
          expect(error.status).toBe(400);
          expect(error.message).toBe("Invalid user email");
        } else {
          fail("Error was not an instance of AppError");
        }
      }

      expect(User.findByEmail).toHaveBeenCalledWith("wrong@email.com");
    });

    test("should throw NotFoundError when answer is not found", async () => {
      const mockEmail = "user@example.com";
      const mockUser = { _id: new mongoose.Types.ObjectId(), email: mockEmail };

      mockRequest.params = { aid: "somewrongid" };
      mockRequest.body = { email: mockEmail };
      (User.findByEmail as jest.Mock).mockResolvedValue(mockUser);
      (Answer.findById as jest.Mock).mockResolvedValue(null);

      try {
        await voteAnswer(mockRequest as Request, mockResponse as Response);
        fail("Expected NotFoundError was not thrown");
      } catch (error: unknown) {
        expect(error).toBeInstanceOf(AppError);
        if (error instanceof AppError) {
          expect(error.status).toBe(404);
          expect(error.message).toBe("Answer not found");
        } else {
          fail("Error was not an instance of AppError");
        }
      }

      expect(User.findByEmail).toHaveBeenCalledWith(mockEmail);
      expect(Answer.findById).toHaveBeenCalledWith("somewrongid");
    });
  });

  describe("addComment", () => {
    it("should add a comment to an answer successfully", async () => {
      // Setup mock data
      const mockAid = "507f1f77bcf86cd799439011";
      const mockEmail = "user@example.com";
      const mockComment = {
        text: "This is a test comment",
        commented_by: mockEmail,
        comment_date_time: new Date().toISOString(),
      };

      const mockUser = {
        _id: new mongoose.Types.ObjectId(),
        email: mockEmail,
      };

      const mockAnswer = {
        _id: new mongoose.Types.ObjectId(mockAid),
        text: "Test answer",
        addComment: jest.fn().mockResolvedValue(true),
      };

      const mockUpdatedAnswer = {
        _id: new mongoose.Types.ObjectId(mockAid),
        text: "Test answer",
        comments: [
          {
            text: mockComment.text,
            commented_by: {
              _id: mockUser._id,
              username: "testuser",
            },
            comment_date_time: new Date(mockComment.comment_date_time),
          },
        ],
      };

      // Setup request
      mockRequest.params = { aid: mockAid };
      mockRequest.body = mockComment;

      // Setup mock implementations
      (User.findByEmail as jest.Mock).mockResolvedValue(mockUser);
      (Answer.findById as jest.Mock)
        .mockResolvedValueOnce(mockAnswer)
        .mockImplementationOnce((id) => {
          expect(id).toBe(mockAid);
          return {
            populate: jest.fn().mockResolvedValue(mockUpdatedAnswer),
          };
        });

      // Call the controller
      await addComment(mockRequest as Request, mockResponse as Response);

      // Assertions
      expect(User.findByEmail).toHaveBeenCalledWith(mockEmail);
      expect(Answer.findById).toHaveBeenCalledWith(mockAid);
      expect(mockAnswer.addComment).toHaveBeenCalledWith({
        text: mockComment.text,
        commented_by: mockUser._id,
        comment_date_time: expect.any(Date),
      });
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          _id: mockAid,
          comments: expect.any(Array),
        })
      );
    });

    it("should return 400 when required comment fields are missing", async () => {
      // Setup request with missing fields
      mockRequest.params = { aid: "answer123" };
      mockRequest.body = {
        // Missing text
        commented_by: "user@example.com",
        comment_date_time: new Date().toISOString(),
      };

      // Call the controller
      await addComment(mockRequest as Request, mockResponse as Response);

      // Assertions
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: "Missing required comment fields",
      });
      expect(User.findByEmail).not.toHaveBeenCalled();
      expect(Answer.findById).not.toHaveBeenCalled();
    });

    it("should return 400 when user is not found", async () => {
      // Setup request
      mockRequest.params = { aid: "answer123" };
      mockRequest.body = {
        text: "Test comment",
        commented_by: "nonexistent@example.com",
        comment_date_time: new Date().toISOString(),
      };

      // Setup mock implementation
      (User.findByEmail as jest.Mock).mockResolvedValue(null);

      // Call the controller
      await addComment(mockRequest as Request, mockResponse as Response);

      // Assertions
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: "Invalid user",
      });
      expect(Answer.findById).not.toHaveBeenCalled();
    });

    it("should return 404 when answer is not found", async () => {
      // Setup mock data with valid ObjectId format
      const mockAid = "507f1f77bcf86cd799439012";

      // Setup request
      mockRequest.params = { aid: mockAid };
      mockRequest.body = {
        text: "Test comment",
        commented_by: "user@example.com",
        comment_date_time: new Date().toISOString(),
      };

      // Setup mock implementations
      (User.findByEmail as jest.Mock).mockResolvedValue({
        _id: new mongoose.Types.ObjectId(),
      });
      (Answer.findById as jest.Mock).mockResolvedValue(null);

      // Call the controller
      await addComment(mockRequest as Request, mockResponse as Response);

      // Assertions
      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: "Answer not found",
      });
    });

    it("should return 404 when answer is not found after adding comment", async () => {
      // Setup mock data
      const mockAid = "507f1f77bcf86cd799439011"; // Valid ObjectId in string format
      const mockEmail = "user@example.com";
      const mockComment = {
        text: "This is a test comment",
        commented_by: mockEmail,
        comment_date_time: new Date().toISOString(),
      };

      const mockUser = {
        _id: new mongoose.Types.ObjectId(),
        email: mockEmail,
      };

      const mockAnswer = {
        _id: new mongoose.Types.ObjectId(mockAid),
        text: "Test answer",
        addComment: jest.fn().mockResolvedValue(true),
      };

      // Setup request
      mockRequest.params = { aid: mockAid };
      mockRequest.body = mockComment;

      // Setup mock implementations
      (User.findByEmail as jest.Mock).mockResolvedValue(mockUser);
      (Answer.findById as jest.Mock)
        .mockResolvedValueOnce(mockAnswer)
        .mockImplementationOnce(() => ({
          populate: jest.fn().mockResolvedValue(null),
        }));

      // Call the controller
      await addComment(mockRequest as Request, mockResponse as Response);

      // Assertions
      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: "Answer not found after comment",
      });
    });

    it("should return 500 when an error occurs", async () => {
      // Setup mock data
      const mockAid = "answer123";
      const mockEmail = "user@example.com";
      const mockComment = {
        text: "This is a test comment",
        commented_by: mockEmail,
        comment_date_time: new Date().toISOString(),
      };

      const mockUser = {
        _id: new mongoose.Types.ObjectId(), // Valid ObjectId
        email: mockEmail,
      };

      // Setup request
      mockRequest.params = { aid: mockAid };
      mockRequest.body = mockComment;

      // Setup mock implementations
      (User.findByEmail as jest.Mock).mockResolvedValue(mockUser);
      (Answer.findById as jest.Mock).mockImplementation(() => {
        throw new Error("Database error");
      });

      // Call the controller
      await addComment(mockRequest as Request, mockResponse as Response);

      // Assertions
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: "Error adding comment",
        error: "Database error",
      });
    });
  });
});
