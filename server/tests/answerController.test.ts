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

    it("should throw error when required fields are missing", async () => {
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
        _id: mockAid,
        hasUserVoted: jest.fn().mockReturnValue(false),
        vote: jest.fn().mockResolvedValue(undefined),
        unvote: jest.fn(),
      };

      mockRequest.params = { aid: mockAid };
      mockRequest.body = { email: mockEmail };

      (User.findByEmail as jest.Mock).mockResolvedValue(mockUser);
      (Answer.findById as jest.Mock).mockResolvedValue(mockAnswer);

      // Call the controller
      await voteAnswer(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

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
      await voteAnswer(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

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
      const mockAid = "507f1f77bcf86cd799439011";
      mockRequest.params = { aid: mockAid };
      mockRequest.body = {};

      // Act
      await voteAnswer(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // Assert
      expect(mockNext).toHaveBeenCalled();
      expect(mockNext.mock.calls[0][0]).toBeInstanceOf(AppError);
      expect(mockNext.mock.calls[0][0].message).toBe(
        "Missing user email in request body"
      );
    });

    test("should throw error when user is not found", async () => {
      // Arrange
      const mockAid = "507f1f77bcf86cd799439011";
      mockRequest.params = { aid: mockAid };
      mockRequest.body = { email: "wrong@email.com" };

      // Mock User.findByEmail to return null
      jest.spyOn(User, "findByEmail").mockImplementation(() => {
        return Promise.resolve(null);
      });

      // Act
      const controllerFn = async () => {
        await voteAnswer(
          mockRequest as Request,
          mockResponse as Response,
          mockNext
        );
      };

      // Execute and capture any errors
      await controllerFn();

      // Assertions
      expect(User.findByEmail).toHaveBeenCalledWith("wrong@email.com");
      expect(mockNext).toHaveBeenCalled();

      // Check that next was called with a BadRequestError
      const error = mockNext.mock.calls[0][0];
      expect(error instanceof AppError).toBeTruthy();
      expect(error.message).toBe("Invalid user email");
    });

    test("should throw error when answer is not found", async () => {
      // Arrange
      const mockAid = "507f1f77bcf86cd7994390";
      const mockEmail = "user@test.com";

      mockRequest.params = { aid: mockAid };
      mockRequest.body = { email: mockEmail };

      const mockUser = { _id: new mongoose.Types.ObjectId(), email: mockEmail };

      // Clear previous mocks
      jest.clearAllMocks();

      User.findByEmail = jest.fn().mockResolvedValue(mockUser);
      Answer.findById = jest.fn().mockResolvedValue(null);

      // Act
      const controllerFn = async () => {
        await voteAnswer(
          mockRequest as Request,
          mockResponse as Response,
          mockNext
        );
      };

      // Execute and capture any errors
      await controllerFn();

      // Assertions
      expect(User.findByEmail).toHaveBeenCalledWith(mockEmail);
      expect(Answer.findById).toHaveBeenCalledWith(mockAid);
      expect(mockNext).toHaveBeenCalled();
      const error = mockNext.mock.calls[0][0];
      expect(error instanceof AppError).toBeTruthy();
      expect(error.message).toBe("Answer not found");
    });
  });

  describe("addComment", () => {
    // it("should add a comment to an answer successfully", async () => {
    //   // Setup mock data
    //   const mockAid = "507f1f77bcf86cd799439011";
    //   const mockEmail = "user@example.com";
    //   const mockComment = {
    //     text: "This is a test comment",
    //     commented_by: mockEmail,
    //     comment_date_time: new Date().toISOString(),
    //   };

    //   const mockUser = {
    //     _id: new mongoose.Types.ObjectId(),
    //     email: mockEmail,
    //   };

    //   const mockAnswer = {
    //     _id: new mongoose.Types.ObjectId(mockAid),
    //     text: "Test answer",
    //     addComment: jest.fn().mockResolvedValue(true),
    //   };

    //   const mockUpdatedAnswer = {
    //     _id: new mongoose.Types.ObjectId(mockAid),
    //     text: "Test answer",
    //     comments: [
    //       {
    //         text: mockComment.text,
    //         commented_by: {
    //           _id: mockUser._id,
    //           username: "testuser",
    //         },
    //         comment_date_time: new Date(mockComment.comment_date_time),
    //       },
    //     ],
    //   };

    //   // Setup request
    //   mockRequest.params = { aid: mockAid };
    //   mockRequest.body = mockComment;

    //   // Setup mock implementations
    //   (User.findByEmail as jest.Mock).mockResolvedValue(mockUser);
    //   (Answer.findById as jest.Mock)
    //     .mockResolvedValueOnce(mockAnswer)
    //     .mockImplementationOnce((id) => {
    //       expect(id).toBe(mockAid);
    //       return {
    //         populate: jest.fn().mockResolvedValue(mockUpdatedAnswer),
    //       };
    //     });

    //   // Call the controller
    //   await addComment(
    //     mockRequest as Request,
    //     mockResponse as Response,
    //     mockNext
    //   );

    //   // Assertions
    //   expect(User.findByEmail).toHaveBeenCalledWith(mockEmail);
    //   expect(Answer.findById).toHaveBeenCalledWith(mockAid);
    //   expect(mockAnswer.addComment).toHaveBeenCalledWith({
    //     text: mockComment.text,
    //     commented_by: mockUser._id,
    //     comment_date_time: expect.any(Date),
    //   });
    //   expect(mockResponse.status).toHaveBeenCalledWith(200);
    //   expect(mockResponse.json).toHaveBeenCalledWith(
    //     expect.objectContaining({
    //       _id: mockAid,
    //       comments: expect.any(Array),
    //     })
    //   );
    // });

    it("should add a comment to an answer successfully", async () => {
      // Setup mock data
      const mockAid = "507f1f77bcf86cd799439011";
      const mockEmail = "user@example.com";
      const mockComment = {
        text: "This is a test comment",
        commented_by: mockEmail,
        comment_date_time: new Date().toISOString(),
      };

      const mockUserId = new mongoose.Types.ObjectId();
      const mockUser = {
        _id: mockUserId,
        email: mockEmail,
      };

      // Create a mock addComment method
      const addCommentMethod = jest.fn().mockResolvedValue(undefined);

      // First mock Answer object returned by findById (with the addComment method)
      const mockAnswer = {
        _id: { toString: () => mockAid },
        text: "Test answer",
        addComment: addCommentMethod,
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

      // Second mock Answer object returned after populating
      const mockPopulatedAnswer = {
        _id: { toString: () => mockAid },
        text: "Test answer",
        comments: [
          {
            text: mockComment.text,
            commented_by: {
              _id: mockUserId,
              username: "testuser",
            },
            comment_date_time: new Date(mockComment.comment_date_time),
          },
        ],
      };

      // Setup request
      mockRequest.params = { aid: mockAid };
      mockRequest.body = mockComment;

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
      await addComment(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // Assertions
      expect(User.findByEmail).toHaveBeenCalledWith(mockEmail);

      // First call to findById
      expect(Answer.findById).toHaveBeenCalledWith(mockAid);

      // Check that addComment was called with the correct parameters
      expect(addCommentMethod).toHaveBeenCalledWith({
        text: mockComment.text,
        commented_by: mockUserId,
        comment_date_time: expect.any(Date),
      });

      // Check the response
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        ...mockPopulatedAnswer,
        _id: mockAid,
      });
    });

    it("should throw error when required comment fields are missing", async () => {
      // Setup request with missing fields
      const mockAid = "507f1f77bcf86cd799439011";
      mockRequest.params = { aid: mockAid };
      mockRequest.body = {
        // Missing text
        commented_by: "user@example.com",
        comment_date_time: new Date().toISOString(),
      };

      // Call the controller
      await addComment(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // Assertions
      expect(mockNext).toHaveBeenCalled();
      expect(mockNext.mock.calls[0][0]).toBeInstanceOf(AppError);
      expect(mockNext.mock.calls[0][0].message).toBe(
        "Missing required comment fields"
      );
    });

    it("should throw error when user is not found", async () => {
      // Setup request
      const mockAid = "507f1f77bcf86cd799439011";
      mockRequest.params = { aid: mockAid };
      mockRequest.body = {
        text: "Test comment",
        commented_by: "user@example.com",
        comment_date_time: new Date().toISOString(),
      };

      // Setup mock implementation
      jest.spyOn(User, "findByEmail").mockImplementation(() => {
        return Promise.resolve(null);
      });

      // Call the controller
      const controllerFn = async () => {
        await addComment(
          mockRequest as Request,
          mockResponse as Response,
          mockNext
        );
      };

      await controllerFn();

      // Assertions
      expect(mockNext).toHaveBeenCalled();
      expect(mockNext.mock.calls[0][0]).toBeInstanceOf(AppError);
      expect(mockNext.mock.calls[0][0].message).toBe("Invalid user email");
      expect(Answer.findById).not.toHaveBeenCalled();
    });

    it("should throw error when answer is not found", async () => {
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

      const controllerFn = async () => {
        await addComment(
          mockRequest as Request,
          mockResponse as Response,
          mockNext
        );
      };

      await controllerFn();

      // Assertions
      expect(mockNext).toHaveBeenCalled();
      expect(mockNext.mock.calls[0][0]).toBeInstanceOf(AppError);
      expect(mockNext.mock.calls[0][0].message).toBe("Answer not found");
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
      const controllerFn = async () => {
        await addComment(
          mockRequest as Request,
          mockResponse as Response,
          mockNext
        );
      };

      await controllerFn();

      // Assertions
      expect(mockNext).toHaveBeenCalled();
      expect(mockNext.mock.calls[0][0]).toBeInstanceOf(AppError);
      expect(mockNext.mock.calls[0][0].message).toBe(
        "Answer not found after comment"
      );
    });
  });
});
