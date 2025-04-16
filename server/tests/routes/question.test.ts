import request from "supertest";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import app from "../../server";
import Question from "../../models/questions";
import Tag from "../../models/tags";
import User from "../../models/users";

// Mock dependencies
jest.mock("../../models/questions");
jest.mock("../../models/tags");
jest.mock("../../models/users");
jest.mock("jsonwebtoken");

describe("Question Routes", () => {
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

    // Mock User.findById
    (User.findById as jest.Mock).mockResolvedValue({
      _id: mockUserId,
      username: "testuser",
      role: "user",
    });

    // Mock User.findById with proper implementation
    (User.findById as jest.Mock).mockImplementation(() => ({
      _id: mockUserId,
      username: "testuser",
      role: "user",
      select: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValue({
        _id: mockUserId,
        username: "testuser",
        role: "user",
      }),
    }));
  });

  afterAll(async () => {
    // Close mongoose connection after all tests
    await mongoose.connection.close();
  });

  describe("POST /question/addQuestion", () => {
    it("should add a new question when authenticated", async () => {
      // Prepare test data
      const mockTags = [
        { _id: new mongoose.Types.ObjectId().toString(), name: "react" },
        { _id: new mongoose.Types.ObjectId().toString(), name: "javascript" },
      ];

      const questionData = {
        title: "Test Question",
        text: "This is a test question",
        tags: [{ name: "react" }, { name: "javascript" }],
        asked_by: "testuser",
        ask_date_time: new Date().toISOString(),
      };

      const createdQuestion = {
        ...questionData,
        _id: new mongoose.Types.ObjectId().toString(),
        views: 0,
        answers: [],
        mostRecentActivity: new Date().toString(),
      };

      // Setup mocks
      (Tag.getTags as jest.Mock).mockResolvedValue(mockTags);
      (Question.addQuestion as jest.Mock).mockResolvedValue(createdQuestion);

      // Execute test
      const response = await request(app)
        .post("/question/addQuestion")
        .set("Authorization", `Bearer ${mockToken}`)
        .send(questionData);

      // Assertions
      expect(response.status).toBe(200);
      expect(Tag.getTags).toHaveBeenCalledWith(questionData.tags);
      expect(Question.addQuestion).toHaveBeenCalled();
      expect(response.body).toEqual(createdQuestion);
    });

    it("should return 401 when not authenticated", async () => {
      const questionData = {
        title: "Test Question",
        text: "This is a test question",
        tags: [{ name: "react" }],
        asked_by: "testuser",
        ask_date_time: new Date().toISOString(),
      };

      const response = await request(app)
        .post("/question/addQuestion")
        .send(questionData);

      console.log(response.body);
      expect(response.status).toBe(401);
    });

    it("should return 400 when missing required fields", async () => {
      // Missing fields in the request
      const incompleteData = {
        title: "Test Question",
        // Missing text, tags, etc.
      };

      await request(app)
        .post("/question/addQuestion")
        .set("Authorization", `Bearer ${mockToken}`)
        .send(incompleteData)
        .expect(400);
    });
  });

  describe("GET /question/getQuestionById/:qid", () => {
    it("should return a question by ID", async () => {
      const mockQuestionId = new mongoose.Types.ObjectId().toString();
      const mockQuestion = {
        _id: mockQuestionId,
        title: "Test Question",
        text: "This is a test question",
        tags: [{ _id: "123", name: "react" }],
        answers: [],
        ask_date_time: new Date().toISOString(),
        views: 1,
        mostRecentActivity: new Date().toString(),
      };

      // Setup mock
      (Question.findByIdAndIncrementViews as jest.Mock).mockResolvedValue(
        mockQuestion
      );

      // Execute test
      const response = await request(app)
        .get(`/question/getQuestionById/${mockQuestionId}`)
        .expect(200);

      // Assertions
      expect(Question.findByIdAndIncrementViews).toHaveBeenCalledWith(
        mockQuestionId
      );
      expect(response.body).toEqual(mockQuestion);
    });

    it("should return 404 when question is not found", async () => {
      const nonExistentId = new mongoose.Types.ObjectId().toString();

      // Setup mock to return null (question not found)
      (Question.findByIdAndIncrementViews as jest.Mock).mockResolvedValue(null);

      const response = await request(app)
        .get(`/question/getQuestionById/${nonExistentId}`)
        .expect(404);

      console.log(nonExistentId + " " + response.body);
    });
  });

  describe("GET /question/getQuestion", () => {
    const mockQuestions = [
      {
        _id: new mongoose.Types.ObjectId().toString(),
        title: "Test Question 1",
        text: "This is test question 1",
        tags: [{ _id: "123", name: "react" }],
        answers: [],
        ask_date_time: new Date().toISOString(),
        views: 5,
        mostRecentActivity: new Date().toString(),
      },
      {
        _id: new mongoose.Types.ObjectId().toString(),
        title: "Test Question 2",
        text: "This is test question 2",
        tags: [{ _id: "456", name: "javascript" }],
        answers: [],
        ask_date_time: new Date().toISOString(),
        views: 10,
        mostRecentActivity: new Date(Date.now() - 86400000).toString(), // 1 day ago
      },
    ];

    it("should return questions ordered by newest", async () => {
      // Setup mock
      (Question.getNewestQuestions as jest.Mock).mockResolvedValue(
        mockQuestions
      );

      // Execute test
      const response = await request(app)
        .get("/question/getQuestion?order=newest")
        .expect(200);

      // Assertions
      expect(Question.getNewestQuestions).toHaveBeenCalled();
      expect(response.body).toEqual(mockQuestions);
    });

    it("should return questions ordered by active", async () => {
      // Setup mock
      (Question.getActiveQuestions as jest.Mock).mockResolvedValue(
        mockQuestions
      );

      // Execute test
      const response = await request(app)
        .get("/question/getQuestion?order=active")
        .expect(200);

      // Assertions
      expect(Question.getActiveQuestions).toHaveBeenCalled();
      expect(response.body).toEqual(mockQuestions);
    });

    it("should return unanswered questions", async () => {
      // Setup mock
      (Question.getUnansweredQuestions as jest.Mock).mockResolvedValue(
        mockQuestions
      );

      // Execute test
      const response = await request(app)
        .get("/question/getQuestion?order=unanswered")
        .expect(200);

      // Assertions
      expect(Question.getUnansweredQuestions).toHaveBeenCalled();
      expect(response.body).toEqual(mockQuestions);
    });

    it("should filter questions by search query", async () => {
      const searchQuery = "react";
      const filteredQuestions = [mockQuestions[0]]; // Only the first question has 'react' tag

      // Setup mocks
      (Question.getNewestQuestions as jest.Mock).mockResolvedValue(
        mockQuestions
      );

      // Use jest's spyOn to mock the searchQuestion utility without actually importing it
      const searchQuestionMock = jest
        .spyOn(require("../../utils/searchQuestion"), "searchQuestion")
        .mockReturnValue(filteredQuestions);

      // Execute test
      const response = await request(app)
        .get(`/question/getQuestion?order=newest&search=${searchQuery}`)
        .expect(200);

      // Assertions
      expect(Question.getNewestQuestions).toHaveBeenCalled();
      expect(searchQuestionMock).toHaveBeenCalledWith(
        mockQuestions,
        searchQuery
      );
      expect(response.body).toEqual(filteredQuestions);

      // Clean up
      searchQuestionMock.mockRestore();
    });

    it("should return 400 for invalid order parameter", async () => {
      await request(app).get("/question/getQuestion?order=invalid").expect(400);
    });
  });
});
