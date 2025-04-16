import request from "supertest";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import app from "../../server";
import Answer from "../../models/answers";
import User from "../../models/users";
import { IAnswer } from "../../types/types";

// Mock dependencies
jest.mock("../../models/answers");
jest.mock("../../models/users");
jest.mock("jsonwebtoken");

describe("Answer Routes", () => {
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

  describe("POST /answer/addAnswer", () => {
    it("should add a new answer when authenticated", async () => {
      // Prepare test data
      const mockQuestionId = new mongoose.Types.ObjectId().toString();
      const answerData: IAnswer = {
        text: "This is a test answer",
        ans_by: "testuser",
        ans_date_time: new Date().toISOString(),
        votes: 0,
        voted_by: [],
        comments: [],
      };

      const requestData = {
        qid: mockQuestionId,
        ans: answerData,
      };

      const createdAnswer: IAnswer = {
        ...answerData,
        _id: new mongoose.Types.ObjectId().toString(),
      };

      // Setup mock
      (Answer.addAnswerToQuestion as jest.Mock).mockResolvedValue(
        createdAnswer
      );

      // Execute test
      const response = await request(app)
        .post("/answer/addAnswer")
        .set("Authorization", `Bearer ${mockToken}`)
        .send(requestData)
        .expect(200);

      // Assertions
      expect(Answer.addAnswerToQuestion).toHaveBeenCalledWith(
        mockQuestionId,
        answerData
      );
      expect(response.body).toEqual(createdAnswer);
    });

    it("should return 401 when not authenticated", async () => {
      // Mock that User.findById returns null for authentication failure
      (User.findById as jest.Mock).mockImplementation(() => ({
        select: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(null),
      }));

      const requestData = {
        qid: new mongoose.Types.ObjectId().toString(),
        ans: {
          text: "This is a test answer",
          ans_by: "testuser",
          ans_date_time: new Date().toISOString(),
        },
      };

      await request(app)
        .post("/answer/addAnswer")
        .send(requestData)
        .expect(401);
    });

    it("should return 400 when missing required fields", async () => {
      // Missing question ID
      const incompleteData = {
        ans: {
          text: "This is a test answer",
          ans_by: "testuser",
          ans_date_time: new Date().toISOString(),
        },
      };

      await request(app)
        .post("/answer/addAnswer")
        .set("Authorization", `Bearer ${mockToken}`)
        .send(incompleteData)
        .expect(400);

      // Missing answer data
      const missingAnswerData = {
        qid: new mongoose.Types.ObjectId().toString(),
      };

      await request(app)
        .post("/answer/addAnswer")
        .set("Authorization", `Bearer ${mockToken}`)
        .send(missingAnswerData)
        .expect(400);
    });
  });

  describe("PATCH /answer/:aid/vote", () => {
    it("should upvote an answer when user has not voted before", async () => {
      const mockAnswerId = new mongoose.Types.ObjectId().toString();
      const userEmail = "test@example.com";

      // Mock the answer object with methods
      const mockAnswer = {
        _id: mockAnswerId,
        text: "Test answer",
        ans_by: "testuser",
        ans_date_time: new Date().toISOString(),
        votes: 0,
        voted_by: [],
        comments: [],
        hasUserVoted: jest.fn().mockReturnValue(false),
        vote: jest.fn().mockResolvedValue(undefined),
        unvote: jest.fn().mockResolvedValue(undefined),
      };

      // Setup mocks
      (Answer.findById as jest.Mock).mockResolvedValue(mockAnswer);
      (User.findByEmail as jest.Mock).mockResolvedValue({
        _id: mockUserId,
        email: userEmail,
      });

      // Execute test
      await request(app)
        .patch(`/answer/${mockAnswerId}/vote`)
        .set("Authorization", `Bearer ${mockToken}`)
        .send({ email: userEmail })
        .expect(200);

      // Assertions
      expect(Answer.findById).toHaveBeenCalledWith(mockAnswerId);
      expect(User.findByEmail).toHaveBeenCalledWith(userEmail);
      expect(mockAnswer.hasUserVoted).toHaveBeenCalledWith(userEmail);
      expect(mockAnswer.vote).toHaveBeenCalledWith(userEmail);
      expect(mockAnswer.unvote).not.toHaveBeenCalled();
    });

    it("should unvote an answer when user has already voted", async () => {
      const mockAnswerId = new mongoose.Types.ObjectId().toString();
      const userEmail = "test@example.com";

      // Mock the answer object with methods
      const mockAnswer = {
        _id: mockAnswerId,
        text: "Test answer",
        ans_by: "testuser",
        ans_date_time: new Date().toISOString(),
        votes: 1,
        voted_by: [userEmail],
        comments: [],
        hasUserVoted: jest.fn().mockReturnValue(true),
        vote: jest.fn().mockResolvedValue(undefined),
        unvote: jest.fn().mockResolvedValue(undefined),
      };

      // Setup mocks
      (Answer.findById as jest.Mock).mockResolvedValue(mockAnswer);
      (User.findByEmail as jest.Mock).mockResolvedValue({
        _id: mockUserId,
        email: userEmail,
      });

      // Execute test
      await request(app)
        .patch(`/answer/${mockAnswerId}/vote`)
        .set("Authorization", `Bearer ${mockToken}`)
        .send({ email: userEmail })
        .expect(200);

      // Assertions
      expect(Answer.findById).toHaveBeenCalledWith(mockAnswerId);
      expect(User.findByEmail).toHaveBeenCalledWith(userEmail);
      expect(mockAnswer.hasUserVoted).toHaveBeenCalledWith(userEmail);
      expect(mockAnswer.unvote).toHaveBeenCalledWith(userEmail);
      expect(mockAnswer.vote).not.toHaveBeenCalled();
    });

    it("should return 401 when not authenticated", async () => {
      // Mock that User.findById returns null for authentication failure
      (User.findById as jest.Mock).mockImplementation(() => ({
        select: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(null),
      }));

      const mockAnswerId = new mongoose.Types.ObjectId().toString();

      await request(app)
        .patch(`/answer/${mockAnswerId}/vote`)
        .send({ email: "test@example.com" })
        .expect(401);
    });

    it("should return 400 when user email is missing", async () => {
      const mockAnswerId = new mongoose.Types.ObjectId().toString();

      await request(app)
        .patch(`/answer/${mockAnswerId}/vote`)
        .set("Authorization", `Bearer ${mockToken}`)
        .send({}) // Missing email
        .expect(400);
    });

    it("should return 400 when user email is invalid", async () => {
      const mockAnswerId = new mongoose.Types.ObjectId().toString();

      // Setup mock to return null for invalid email
      (User.findByEmail as jest.Mock).mockResolvedValue(null);

      await request(app)
        .patch(`/answer/${mockAnswerId}/vote`)
        .set("Authorization", `Bearer ${mockToken}`)
        .send({ email: "invalid@example.com" })
        .expect(400);
    });

    it("should return 404 when answer is not found", async () => {
      const mockAnswerId = new mongoose.Types.ObjectId().toString();

      // Setup mock to return null for answer not found
      (Answer.findById as jest.Mock).mockResolvedValue(null);
      (User.findByEmail as jest.Mock).mockResolvedValue({
        _id: mockUserId,
        email: "test@example.com",
      });

      await request(app)
        .patch(`/answer/${mockAnswerId}/vote`)
        .set("Authorization", `Bearer ${mockToken}`)
        .send({ email: "test@example.com" })
        .expect(404);
    });
  });

  describe("POST /answer/:aid/addComment", () => {
    it("should add a comment to an answer when authenticated", async () => {
      const mockAnswerId = new mongoose.Types.ObjectId().toString();
      const commentData = {
        text: "This is a test comment",
        commented_by: "test@example.com",
        comment_date_time: new Date().toISOString(),
      };

      // Mock the answer object with methods
      const mockAnswer = {
        _id: mockAnswerId,
        text: "Test answer",
        ans_by: "testuser",
        ans_date_time: new Date().toISOString(),
        votes: 0,
        voted_by: [],
        comments: [],
        addComment: jest.fn().mockResolvedValue(undefined),
      };

      const mockUpdatedAnswer = {
        ...mockAnswer,
        comments: [
          {
            _id: new mongoose.Types.ObjectId().toString(),
            text: commentData.text,
            commented_by: {
              _id: mockUserId,
              username: "testuser",
            },
            comment_date_time: commentData.comment_date_time,
          },
        ],
      };

      // Setup mocks
      (Answer.findById as jest.Mock)
        .mockResolvedValueOnce(mockAnswer) // First call when adding comment
        .mockImplementationOnce(() => ({
          // Second call when fetching updated answer
          populate: jest.fn().mockResolvedValue(mockUpdatedAnswer),
        }));

      (User.findByEmail as jest.Mock).mockResolvedValue({
        _id: mockUserId,
        email: "test@example.com",
        username: "testuser",
      });

      // Execute test
      const response = await request(app)
        .post(`/answer/${mockAnswerId}/addComment`)
        .set("Authorization", `Bearer ${mockToken}`)
        .send(commentData);
      console.log(response.body);

      // Assertions
      expect(response.status).toBe(200);
      expect(Answer.findById).toHaveBeenCalledWith(mockAnswerId);
      expect(User.findByEmail).toHaveBeenCalledWith(commentData.commented_by);
      expect(mockAnswer.addComment).toHaveBeenCalledWith({
        text: commentData.text,
        commented_by: mockUserId,
        comment_date_time: expect.any(Date),
      });
    });

    it("should return 401 when not authenticated", async () => {
      // Mock that User.findById returns null for authentication failure
      (User.findById as jest.Mock).mockImplementation(() => ({
        select: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(null),
      }));

      const mockAnswerId = new mongoose.Types.ObjectId().toString();
      const commentData = {
        text: "This is a test comment",
        commented_by: "test@example.com",
        comment_date_time: new Date().toISOString(),
      };

      await request(app)
        .post(`/answer/${mockAnswerId}/addComment`)
        .send(commentData)
        .expect(401);
    });

    it("should return 400 when missing required fields", async () => {
      const mockAnswerId = new mongoose.Types.ObjectId().toString();

      // Missing text
      const missingText = {
        commented_by: "test@example.com",
        comment_date_time: new Date().toISOString(),
      };

      await request(app)
        .post(`/answer/${mockAnswerId}/addComment`)
        .set("Authorization", `Bearer ${mockToken}`)
        .send(missingText)
        .expect(400);

      // Missing commented_by
      const missingCommentedBy = {
        text: "This is a test comment",
        comment_date_time: new Date().toISOString(),
      };

      await request(app)
        .post(`/answer/${mockAnswerId}/addComment`)
        .set("Authorization", `Bearer ${mockToken}`)
        .send(missingCommentedBy)
        .expect(400);
    });

    it("should return 400 when user is invalid", async () => {
      const mockAnswerId = new mongoose.Types.ObjectId().toString();
      const commentData = {
        text: "This is a test comment",
        commented_by: "invalid@example.com",
        comment_date_time: new Date().toISOString(),
      };

      // Setup mock to return null for invalid user
      (User.findByEmail as jest.Mock).mockResolvedValue(null);

      await request(app)
        .post(`/answer/${mockAnswerId}/addComment`)
        .set("Authorization", `Bearer ${mockToken}`)
        .send(commentData)
        .expect(400);
    });

    it("should return 404 when answer is not found", async () => {
      const mockAnswerId = new mongoose.Types.ObjectId().toString();
      const commentData = {
        text: "This is a test comment",
        commented_by: "test@example.com",
        comment_date_time: new Date().toISOString(),
      };

      // Setup mocks
      (Answer.findById as jest.Mock).mockResolvedValue(null);
      (User.findByEmail as jest.Mock).mockResolvedValue({
        _id: mockUserId,
        email: "test@example.com",
      });

      await request(app)
        .post(`/answer/${mockAnswerId}/addComment`)
        .set("Authorization", `Bearer ${mockToken}`)
        .send(commentData)
        .expect(404);
    });
  });
});
