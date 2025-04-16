import express, { Application } from "express";
import request from "supertest";
import answerRoutes from "../../routes/answer";
import {
  addAnswer,
  voteAnswer,
  addComment,
} from "../../controllers/answerController";
import { authenticate } from "../../middlewares/authMiddleware";

// Mock the controller functions and middleware
jest.mock("../../controllers/answerController", () => ({
  addAnswer: jest.fn((req, res) => {
    res.status(201).json({ success: true, message: "Answer added" });
  }),
  voteAnswer: jest.fn((req, res) => {
    res.status(200).json({ success: true, message: "Vote toggled" });
  }),
  addComment: jest.fn((req, res) => {
    res.status(201).json({ success: true, message: "Comment added" });
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

describe("Answer Routes", () => {
  let app: Application;

  beforeEach(() => {
    // Create a fresh express app for each test
    app = express();

    // Mount the router at the appropriate path
    app.use("/answers", answerRoutes);

    jest.clearAllMocks();
  });

  describe("POST /answers/addAnswer", () => {
    test("should route to addAnswer controller with authentication", async () => {
      // Make a request to the endpoint
      const response = await request(app)
        .post("/answers/addAnswer")
        .send({ content: "This is a test answer", questionId: "question123" });

      // Verify the response
      expect(response.status).toBe(201);
      expect(response.body).toEqual({ success: true, message: "Answer added" });

      // Verify the middleware and controller were called
      expect(authenticate).toHaveBeenCalledTimes(1);
      expect(addAnswer).toHaveBeenCalledTimes(1);
    });
  });

  describe("PATCH /answers/:aid/vote", () => {
    test("should route to voteAnswer controller with authentication", async () => {
      // Make a request to the endpoint with a parameter
      const response = await request(app)
        .patch("/answers/answer123/vote")
        .send({ email: "test@example.com" });

      // Verify the response
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ success: true, message: "Vote toggled" });

      // Verify the middleware and controller were called
      expect(authenticate).toHaveBeenCalledTimes(1);
      expect(voteAnswer).toHaveBeenCalledTimes(1);

      // Verify params were passed correctly
      const requestPassedToController = (voteAnswer as jest.Mock).mock
        .calls[0][0];
      expect(requestPassedToController.params.aid).toBe("answer123");
    });
  });

  describe("POST /answers/:aid/addComment", () => {
    test("should route to addComment controller with authentication", async () => {
      // Make a request to the endpoint with a parameter
      const response = await request(app)
        .post("/answers/answer123/addComment")
        .send({ content: "This is a test comment" });

      // Verify the response
      expect(response.status).toBe(201);
      expect(response.body).toEqual({
        success: true,
        message: "Comment added",
      });

      // Verify the middleware and controller were called
      expect(authenticate).toHaveBeenCalledTimes(1);
      expect(addComment).toHaveBeenCalledTimes(1);

      // Verify params were passed correctly
      const requestPassedToController = (addComment as jest.Mock).mock
        .calls[0][0];
      expect(requestPassedToController.params.aid).toBe("answer123");
    });
  });

  test("should handle unauthorized requests", async () => {
    // Override the authenticate middleware to simulate unauthorized access
    (authenticate as jest.Mock).mockImplementationOnce((req, res, next) => {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    });

    // Make a request that should be blocked
    const response = await request(app).post("/answers/addAnswer");

    // Verify the response
    expect(response.status).toBe(401);
    expect(response.body).toEqual({ success: false, message: "Unauthorized" });

    // Verify the controller was not called
    expect(addAnswer).not.toHaveBeenCalled();
  });
});
