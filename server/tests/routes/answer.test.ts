import request from "supertest";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import Answer from "../../models/answers";
import User from "../../models/users";

// Mock these for testing
jest.mock("../../models/answers");
jest.mock("../../models/users");
jest.mock("jsonwebtoken");
jest.mock("../../middlewares/authMiddleware", () => ({
  authenticate: jest.fn((req, res, next) => {
    // Set authenticated user in request
    req.user = { id: "mockUserId", role: "user" };
    next();
  }),
  isAdmin: jest.fn((req, res, next) => next()),
}));

// Import the server
const app = require("../../server");

describe("Answer Routes", () => {
  const mockAnswer = {
    _id: "mockAnswerId",
    text: "Test answer content",
    ans_by: "testUser",
    ans_date_time: new Date().toISOString(),
    votes: 0,
    voted_by: [],
    comments: [],
  };

  const mockUser = {
    _id: "mockUserId",
    username: "testUser",
    email: "test@example.com",
    role: "user",
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let authToken: string;

  beforeEach(() => {
    jest.clearAllMocks();
    // Generate mock auth token
    authToken = "mockToken";
    (jwt.verify as jest.Mock).mockReturnValue({ id: mockUser._id });
    (User.findById as jest.Mock).mockResolvedValue(mockUser);
  });

  afterAll(async () => {
    await mongoose.disconnect();
    app.close();
  });

  describe("POST /answer/addAnswer", () => {
    const newAnswerData = {
      qid: "mockQuestionId",
      ans: {
        text: "New test answer",
        ans_by: "testUser",
        ans_date_time: new Date().toISOString(),
      },
    };

    it("should add a new answer", async () => {
      // Mock the function called by the route handler
      (Answer.addAnswerToQuestion as jest.Mock).mockResolvedValue({
        ...newAnswerData.ans,
        _id: "newAnswerId",
        votes: 0,
        voted_by: [],
      });

      const response = await request(app)
        .post("/answer/addAnswer")
        .send(newAnswerData);

      expect(response.status).toBe(200);
      expect(Answer.addAnswerToQuestion).toHaveBeenCalledWith(
        newAnswerData.qid,
        newAnswerData.ans
      );
      expect(response.body._id).toBe("newAnswerId");
    });

    it("should return 400 if required fields are missing", async () => {
      const response = await request(app)
        .post("/answer/addAnswer")
        .send({ qid: "mockQuestionId" });

      expect(response.status).toBe(400);
    });
  });

  describe("PATCH /answer/:aid/vote", () => {
    it("should upvote an answer when user has not voted before", async () => {
      // Mock the necessary functions
      const mockAnswerDoc = {
        _id: "mockAnswerId",
        text: "Test answer",
        hasUserVoted: jest.fn().mockReturnValue(false),
        vote: jest.fn().mockResolvedValue(undefined),
        toObject: jest.fn().mockReturnValue(mockAnswer),
      };

      (Answer.findById as jest.Mock).mockResolvedValue(mockAnswerDoc);
      (User.findByEmail as jest.Mock).mockResolvedValue(mockUser);

      const response = await request(app)
        .patch("/answer/mockAnswerId/vote")
        .send({ email: "test@example.com" });

      expect(response.status).toBe(200);
      expect(mockAnswerDoc.hasUserVoted).toHaveBeenCalledWith(
        "test@example.com"
      );
      expect(mockAnswerDoc.vote).toHaveBeenCalledWith("test@example.com");
    });

    it("should unvote an answer when user has already voted", async () => {
      // Mock the necessary functions
      const mockAnswerDoc = {
        _id: "mockAnswerId",
        text: "Test answer",
        hasUserVoted: jest.fn().mockReturnValue(true),
        unvote: jest.fn().mockResolvedValue(undefined),
        toObject: jest.fn().mockReturnValue(mockAnswer),
      };

      (Answer.findById as jest.Mock).mockResolvedValue(mockAnswerDoc);
      (User.findByEmail as jest.Mock).mockResolvedValue(mockUser);

      const response = await request(app)
        .patch("/answer/mockAnswerId/vote")
        .send({ email: "test@example.com" });

      expect(response.status).toBe(200);
      expect(mockAnswerDoc.hasUserVoted).toHaveBeenCalledWith(
        "test@example.com"
      );
      expect(mockAnswerDoc.unvote).toHaveBeenCalledWith("test@example.com");
    });

    it("should return 400 if email is missing", async () => {
      const response = await request(app)
        .patch("/answer/mockAnswerId/vote")
        .send({});

      expect(response.status).toBe(400);
    });

    it("should return 404 if answer is not found", async () => {
      (Answer.findById as jest.Mock).mockResolvedValue(null);
      (User.findByEmail as jest.Mock).mockResolvedValue(mockUser);

      const response = await request(app)
        .patch("/answer/nonexistentId/vote")
        .send({ email: "test@example.com" });

      expect(response.status).toBe(404);
    });
  });

  describe("POST /answer/:aid/addComment", () => {
    const newCommentData = {
      text: "Test comment",
      commented_by: "test@example.com",
      comment_date_time: new Date().toISOString(),
    };

    it("should add a comment to an answer", async () => {
      // Mock the necessary functions
      const mockAnswerDoc = {
        _id: "mockAnswerId",
        addComment: jest.fn().mockResolvedValue(undefined),
      };

      (Answer.findById as jest.Mock).mockImplementation((id) => {
        if (id === "mockAnswerId") return mockAnswerDoc;
        return null;
      });

      (User.findByEmail as jest.Mock).mockResolvedValue({
        _id: "mockUserId",
        email: "test@example.com",
      });

      const updatedAnswer = {
        ...mockAnswer,
        comments: [
          {
            text: "Test comment",
            commented_by: { _id: "mockUserId", username: "testUser" },
            comment_date_time: newCommentData.comment_date_time,
          },
        ],
      };

      (Answer.findById as jest.Mock)
        .mockImplementationOnce(() => mockAnswerDoc)
        .mockImplementationOnce(() => ({
          ...mockAnswerDoc,
          populate: jest.fn().mockResolvedValue(updatedAnswer),
        }));

      const response = await request(app)
        .post("/answer/mockAnswerId/addComment")
        .send(newCommentData);

      expect(response.status).toBe(200);
      expect(mockAnswerDoc.addComment).toHaveBeenCalled();
      expect(User.findByEmail).toHaveBeenCalledWith("test@example.com");
    });

    it("should return 400 if required fields are missing", async () => {
      const response = await request(app)
        .post("/answer/mockAnswerId/addComment")
        .send({ text: "Incomplete comment" });

      expect(response.status).toBe(400);
    });

    it("should return 404 if answer is not found", async () => {
      (Answer.findById as jest.Mock).mockResolvedValue(null);
      (User.findByEmail as jest.Mock).mockResolvedValue(mockUser);

      const response = await request(app)
        .post("/answer/nonexistentId/addComment")
        .send(newCommentData);

      expect(response.status).toBe(404);
    });
  });
});
