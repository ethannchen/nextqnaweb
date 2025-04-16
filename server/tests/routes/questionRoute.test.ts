import express, { Application } from "express";
import request from "supertest";
import questionRoutes from "../../routes/question";
import {
  addQuestion,
  getQuestionById,
  getQuestion,
} from "../../controllers/questionController";
import { authenticate } from "../../middlewares/authMiddleware";

// Mock the controller functions and middleware
jest.mock("../../controllers/questionController", () => ({
  addQuestion: jest.fn((req, res) => {
    res.status(200).json({ success: true, message: "Question added" });
  }),
  getQuestionById: jest.fn((req, res) => {
    res.status(200).json({ success: true, question: { _id: req.params.qid } });
  }),
  getQuestion: jest.fn((req, res) => {
    res.status(200).json({ success: true, questions: [] });
  }),
}));

// Mock the authenticate middleware
jest.mock("../../middlewares/authMiddleware", () => ({
  authenticate: jest.fn((req, res, next) => {
    // Simulate successful authentication
    req.user = { id: "user123", email: "test@example.com" };
    next();
  }),
}));

describe("Question Routes", () => {
  let app: Application;

  beforeEach(() => {
    // Create a fresh express app for each test
    app = express();

    // Mount the router at the appropriate path
    app.use("/question", questionRoutes);

    jest.clearAllMocks();
  });

  describe("POST /question/addQuestion", () => {
    test("should route to addQuestion controller with authentication", async () => {
      // Set up mock request data
      const questionData = {
        title: "Test Question",
        text: "This is a test question",
        tags: [{ name: "javascript" }, { name: "react" }],
        asked_by: "testuser",
        ask_date_time: new Date().toISOString(),
      };

      // Make a request to the endpoint
      const response = await request(app)
        .post("/question/addQuestion")
        .send(questionData);

      // Verify the response
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        success: true,
        message: "Question added",
      });

      // Verify the middleware and controller were called
      expect(authenticate).toHaveBeenCalledTimes(1);
      expect(addQuestion).toHaveBeenCalledTimes(1);
    });

    test("should handle unauthorized requests", async () => {
      // Override the authenticate middleware to simulate unauthorized access
      (authenticate as jest.Mock).mockImplementationOnce((req, res) => {
        return res
          .status(401)
          .json({ success: false, message: "Unauthorized" });
      });

      // Make a request that should be blocked
      const response = await request(app).post("/question/addQuestion");

      // Verify the response
      expect(response.status).toBe(401);
      expect(response.body).toEqual({
        success: false,
        message: "Unauthorized",
      });

      // Verify the controller was not called
      expect(addQuestion).not.toHaveBeenCalled();
    });
  });

  describe("GET /question/getQuestionById/:qid", () => {
    test("should route to getQuestionById controller", async () => {
      // Make a request to the endpoint with a parameter
      const response = await request(app).get(
        "/question/getQuestionById/123456"
      );

      // Verify the response
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        success: true,
        question: { _id: "123456" },
      });

      // Verify the controller was called
      expect(getQuestionById).toHaveBeenCalledTimes(1);

      // Verify that the controller received the correct parameters
      const requestPassedToController = (getQuestionById as jest.Mock).mock
        .calls[0][0];
      expect(requestPassedToController.params.qid).toBe("123456");
    });
  });

  describe("GET /question/getQuestion", () => {
    test("should route to getQuestion controller without parameters", async () => {
      // Make a request to the endpoint without query parameters
      const response = await request(app).get("/question/getQuestion");

      // Verify the response
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ success: true, questions: [] });

      // Verify the controller was called
      expect(getQuestion).toHaveBeenCalledTimes(1);
    });

    test("should route to getQuestion controller with query parameters", async () => {
      // Make a request to the endpoint with query parameters
      const response = await request(app)
        .get("/question/getQuestion")
        .query({ order: "newest", search: "javascript" });

      // Verify the response
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ success: true, questions: [] });

      // Verify the controller was called
      expect(getQuestion).toHaveBeenCalledTimes(1);

      // Verify that the controller received the correct query parameters
      const requestPassedToController = (getQuestion as jest.Mock).mock
        .calls[0][0];
      expect(requestPassedToController.query.order).toBe("newest");
      expect(requestPassedToController.query.search).toBe("javascript");
    });
  });
});
