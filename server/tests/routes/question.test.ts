import request from "supertest";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import Question from "../../models/questions";
import User from "../../models/users";
import Tag from "../../models/tags";

// Mock these for testing
jest.mock("../../models/questions");
jest.mock("../../models/users");
jest.mock("../../models/tags");
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

describe("Question Routes", () => {
  const mockQuestion = {
    _id: "mockQuestionId",
    title: "Test Question",
    text: "Test content",
    tags: [{ _id: "tag1", name: "javascript" }],
    answers: [],
    asked_by: "testUser",
    ask_date_time: new Date().toISOString(),
    views: 0,
    mostRecentActivity: new Date().toISOString(),
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

  describe("GET /question/getQuestion", () => {
    it("should get questions with default newest order", async () => {
      // Mock the function called by the route handler
      (Question.getNewestQuestions as jest.Mock).mockResolvedValue([
        mockQuestion,
      ]);

      const response = await request(app).get("/question/getQuestion");

      expect(response.status).toBe(200);
      expect(Question.getNewestQuestions).toHaveBeenCalled();
      expect(response.body).toEqual([mockQuestion]);
    });

    it("should get questions with active order", async () => {
      // Mock the function called by the route handler
      (Question.getActiveQuestions as jest.Mock).mockResolvedValue([
        mockQuestion,
      ]);

      const response = await request(app).get(
        "/question/getQuestion?order=active"
      );

      expect(response.status).toBe(200);
      expect(Question.getActiveQuestions).toHaveBeenCalled();
      expect(response.body).toEqual([mockQuestion]);
    });

    it("should get questions with unanswered order", async () => {
      // Mock the function called by the route handler
      (Question.getUnansweredQuestions as jest.Mock).mockResolvedValue([
        mockQuestion,
      ]);

      const response = await request(app).get(
        "/question/getQuestion?order=unanswered"
      );

      expect(response.status).toBe(200);
      expect(Question.getUnansweredQuestions).toHaveBeenCalled();
      expect(response.body).toEqual([mockQuestion]);
    });

    it("should return 400 for invalid order", async () => {
      const response = await request(app).get(
        "/question/getQuestion?order=invalid"
      );

      expect(response.status).toBe(400);
    });

    it("should filter questions with search parameter", async () => {
      // First it gets questions, then filters them
      (Question.getNewestQuestions as jest.Mock).mockResolvedValue([
        mockQuestion,
      ]);

      const response = await request(app).get(
        "/question/getQuestion?search=Test"
      );

      expect(response.status).toBe(200);
      expect(Question.getNewestQuestions).toHaveBeenCalled();
    });
  });

  describe("GET /question/getQuestionById/:qid", () => {
    it("should get a question by ID", async () => {
      // Mock the function called by the route handler
      (Question.findByIdAndIncrementViews as jest.Mock).mockResolvedValue(
        mockQuestion
      );

      const response = await request(app).get(
        "/question/getQuestionById/mockQuestionId"
      );

      expect(response.status).toBe(200);
      expect(Question.findByIdAndIncrementViews).toHaveBeenCalledWith(
        "mockQuestionId"
      );
      expect(response.body).toEqual(mockQuestion);
    });

    it("should return 404 if question not found", async () => {
      // Mock the function to return null (question not found)
      (Question.findByIdAndIncrementViews as jest.Mock).mockResolvedValue(null);

      const response = await request(app).get(
        "/question/getQuestionById/nonexistentId"
      );

      expect(response.status).toBe(404);
    });
  });

  describe("POST /question/addQuestion", () => {
    const newQuestionData = {
      title: "New Question",
      text: "Question content",
      tags: [{ name: "javascript" }],
      asked_by: "testUser",
      ask_date_time: new Date().toISOString(),
    };

    it("should add a new question", async () => {
      // Mock the functions called by the route handler
      (Tag.getTags as jest.Mock).mockResolvedValue([
        { _id: "tag1", name: "javascript" },
      ]);
      (Question.addQuestion as jest.Mock).mockResolvedValue({
        ...newQuestionData,
        _id: "newQuestionId",
        views: 0,
        answers: [],
      });

      const response = await request(app)
        .post("/question/addQuestion")
        .send(newQuestionData);

      expect(response.status).toBe(200);
      expect(Tag.getTags).toHaveBeenCalledWith(newQuestionData.tags);
      expect(Question.addQuestion).toHaveBeenCalled();
      expect(response.body._id).toBe("newQuestionId");
    });

    it("should return 400 if required fields are missing", async () => {
      const response = await request(app)
        .post("/question/addQuestion")
        .send({ title: "Incomplete Question" });

      expect(response.status).toBe(400);
    });
  });
});
