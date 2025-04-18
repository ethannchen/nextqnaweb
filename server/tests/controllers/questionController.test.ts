/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response, NextFunction } from "express";
import Question from "../../models/questions";
import Tag from "../../models/tags";
import { BadRequestError, NotFoundError } from "../../utils/errorUtils";
import { searchQuestion } from "../../utils/searchQuestion";
import { strategies } from "../../utils/sortQuestion";
import * as questionController from "../../controllers/questionController";

// Mock express-async-handler
jest.mock("express-async-handler", () => (fn: any) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      return await fn(req, res, next);
    } catch (error) {
      return next(error);
    }
  };
});

// Mock dependencies
jest.mock("../../models/questions");
jest.mock("../../models/tags");
jest.mock("../../utils/searchQuestion");
jest.mock("../../utils/sortQuestion", () => ({
  strategies: {
    newest: jest.fn(),
    active: jest.fn(),
    unanswered: jest.fn(),
  },
}));

describe("Question Controller", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: jest.Mock;
  let mockQuestionData: any;
  let mockTagData: any;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();

    // Reset all mocks
    jest.clearAllMocks();

    // Mock data
    mockQuestionData = {
      _id: "60d21b4667d0d8992e610c85",
      title: "Test Question",
      text: "Test question text",
      tags: [
        { _id: "60d21b4667d0d8992e610c86", name: "javascript" },
        { _id: "60d21b4667d0d8992e610c87", name: "react" },
      ],
      answers: [],
      asked_by: "testuser",
      ask_date_time: new Date().toISOString(),
      views: 0,
      mostRecentActivity: new Date(),
    };

    mockTagData = [
      { _id: "60d21b4667d0d8992e610c86", name: "javascript" },
      { _id: "60d21b4667d0d8992e610c87", name: "react" },
    ];
  });

  describe("addQuestion", () => {
    it("should add a question successfully", async () => {
      // Arrange
      req.body = {
        title: "Test Question",
        text: "Test question text",
        tags: [{ name: "javascript" }, { name: "react" }],
        asked_by: "testuser",
        ask_date_time: new Date().toISOString(),
      };

      (Tag.getTags as jest.Mock).mockResolvedValue(mockTagData);
      (Question.addQuestion as jest.Mock).mockResolvedValue(mockQuestionData);

      // Act
      await questionController.addQuestion(
        req as Request,
        res as Response,
        next
      );

      // Assert
      expect(Tag.getTags).toHaveBeenCalledWith(req.body.tags);
      expect(Question.addQuestion).toHaveBeenCalledWith(
        expect.objectContaining({
          title: req.body.title,
          text: req.body.text,
          tags: mockTagData,
          asked_by: req.body.asked_by,
          ask_date_time: req.body.ask_date_time,
          views: 0,
          answers: [],
        })
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockQuestionData);
      expect(next).not.toHaveBeenCalled();
    });

    it("should throw BadRequestError when missing required fields", async () => {
      // Arrange
      req.body = {
        title: "Test Question",
        // Missing text field
        tags: [{ name: "javascript" }, { name: "react" }],
        asked_by: "testuser",
        ask_date_time: new Date().toISOString(),
      };

      // Act
      await questionController.addQuestion(
        req as Request,
        res as Response,
        next
      );

      // Assert
      expect(next).toHaveBeenCalledWith(expect.any(BadRequestError));
      expect(next.mock.calls[0][0].message).toBe("Missing required fields");
      expect(Tag.getTags).not.toHaveBeenCalled();
      expect(Question.addQuestion).not.toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });

    it("should handle errors from Tag.getTags", async () => {
      // Arrange
      req.body = {
        title: "Test Question",
        text: "Test question text",
        tags: [{ name: "javascript" }, { name: "react" }],
        asked_by: "testuser",
        ask_date_time: new Date().toISOString(),
      };

      const error = new Error("Tag error");
      (Tag.getTags as jest.Mock).mockRejectedValue(error);

      // Act
      await questionController.addQuestion(
        req as Request,
        res as Response,
        next
      );

      // Assert
      expect(Tag.getTags).toHaveBeenCalledWith(req.body.tags);
      expect(next).toHaveBeenCalledWith(error);
      expect(Question.addQuestion).not.toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });

    it("should handle errors from Question.addQuestion", async () => {
      // Arrange
      req.body = {
        title: "Test Question",
        text: "Test question text",
        tags: [{ name: "javascript" }, { name: "react" }],
        asked_by: "testuser",
        ask_date_time: new Date().toISOString(),
      };

      (Tag.getTags as jest.Mock).mockResolvedValue(mockTagData);
      const error = new Error("Question error");
      (Question.addQuestion as jest.Mock).mockRejectedValue(error);

      // Act
      await questionController.addQuestion(
        req as Request,
        res as Response,
        next
      );

      // Assert
      expect(Tag.getTags).toHaveBeenCalledWith(req.body.tags);
      expect(Question.addQuestion).toHaveBeenCalled();
      expect(next).toHaveBeenCalledWith(error);
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });
  });

  describe("getQuestionById", () => {
    it("should get a question by ID successfully", async () => {
      // Arrange
      req.params = {
        qid: "60d21b4667d0d8992e610c85",
      };

      (Question.findByIdAndIncrementViews as jest.Mock).mockResolvedValue(
        mockQuestionData
      );

      // Act
      await questionController.getQuestionById(
        req as Request,
        res as Response,
        next
      );

      // Assert
      expect(Question.findByIdAndIncrementViews).toHaveBeenCalledWith(
        req.params.qid
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockQuestionData);
      expect(next).not.toHaveBeenCalled();
    });

    it("should throw NotFoundError when question is not found", async () => {
      // Arrange
      req.params = {
        qid: "60d21b4667d0d8992e610c85",
      };

      (Question.findByIdAndIncrementViews as jest.Mock).mockResolvedValue(null);

      // Act
      await questionController.getQuestionById(
        req as Request,
        res as Response,
        next
      );

      // Assert
      expect(Question.findByIdAndIncrementViews).toHaveBeenCalledWith(
        req.params.qid
      );
      expect(next).toHaveBeenCalledWith(expect.any(NotFoundError));
      expect(next.mock.calls[0][0].message).toBe("Question not found");
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });

    it("should handle errors from Question.findByIdAndIncrementViews", async () => {
      // Arrange
      req.params = {
        qid: "60d21b4667d0d8992e610c85",
      };

      const error = new Error("Database error");
      (Question.findByIdAndIncrementViews as jest.Mock).mockRejectedValue(
        error
      );

      // Act
      await questionController.getQuestionById(
        req as Request,
        res as Response,
        next
      );

      // Assert
      expect(Question.findByIdAndIncrementViews).toHaveBeenCalledWith(
        req.params.qid
      );
      expect(next).toHaveBeenCalledWith(error);
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });
  });

  describe("getQuestion", () => {
    it("should get questions with default newest order", async () => {
      // Arrange
      req.query = {};
      const questionsData = [
        mockQuestionData,
        { ...mockQuestionData, _id: "60d21b4667d0d8992e610c86" },
      ];

      (strategies.newest as jest.Mock).mockResolvedValue(questionsData);

      // Act
      await questionController.getQuestion(
        req as Request,
        res as Response,
        next
      );

      // Assert
      expect(strategies.newest).toHaveBeenCalled();
      expect(searchQuestion).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(questionsData);
      expect(next).not.toHaveBeenCalled();
    });

    it("should get questions with newest order when order is invalid", async () => {
      // Arrange
      req.query = {
        order: "invalid_order",
      };
      const questionsData = [
        mockQuestionData,
        { ...mockQuestionData, _id: "60d21b4667d0d8992e610c86" },
      ];

      (strategies.newest as jest.Mock).mockResolvedValue(questionsData);

      // Act
      await questionController.getQuestion(
        req as Request,
        res as Response,
        next
      );

      // Assert
      expect(strategies.newest).toHaveBeenCalled();
      expect(searchQuestion).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(questionsData);
      expect(next).not.toHaveBeenCalled();
    });

    it("should get questions with active order", async () => {
      // Arrange
      req.query = {
        order: "active",
      };
      const questionsData = [
        mockQuestionData,
        { ...mockQuestionData, _id: "60d21b4667d0d8992e610c86" },
      ];

      (strategies.active as jest.Mock).mockResolvedValue(questionsData);

      // Act
      await questionController.getQuestion(
        req as Request,
        res as Response,
        next
      );

      // Assert
      expect(strategies.active).toHaveBeenCalled();
      expect(searchQuestion).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(questionsData);
      expect(next).not.toHaveBeenCalled();
    });

    it("should get questions with unanswered order", async () => {
      // Arrange
      req.query = {
        order: "unanswered",
      };
      const questionsData = [
        mockQuestionData,
        { ...mockQuestionData, _id: "60d21b4667d0d8992e610c86" },
      ];

      (strategies.unanswered as jest.Mock).mockResolvedValue(questionsData);

      // Act
      await questionController.getQuestion(
        req as Request,
        res as Response,
        next
      );

      // Assert
      expect(strategies.unanswered).toHaveBeenCalled();
      expect(searchQuestion).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(questionsData);
      expect(next).not.toHaveBeenCalled();
    });

    it("should filter questions by search query", async () => {
      // Arrange
      req.query = {
        order: "newest",
        search: "javascript",
      };

      const questionsData = [
        mockQuestionData,
        { ...mockQuestionData, _id: "60d21b4667d0d8992e610c86" },
      ];
      const filteredData = [mockQuestionData];

      (strategies.newest as jest.Mock).mockResolvedValue(questionsData);
      (searchQuestion as jest.Mock).mockReturnValue(filteredData);

      // Act
      await questionController.getQuestion(
        req as Request,
        res as Response,
        next
      );

      // Assert
      expect(strategies.newest).toHaveBeenCalled();
      expect(searchQuestion).toHaveBeenCalledWith(questionsData, "javascript");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(filteredData);
      expect(next).not.toHaveBeenCalled();
    });

    it("should handle errors from strategy function", async () => {
      // Arrange
      req.query = {
        order: "newest",
      };

      const error = new Error("Strategy error");
      (strategies.newest as jest.Mock).mockRejectedValue(error);

      // Act
      await questionController.getQuestion(
        req as Request,
        res as Response,
        next
      );

      // Assert
      expect(strategies.newest).toHaveBeenCalled();
      expect(next).toHaveBeenCalledWith(error);
      expect(searchQuestion).not.toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });

    it("should not search when search query is empty", async () => {
      // Arrange
      req.query = {
        order: "newest",
        search: "",
      };

      const questionsData = [
        mockQuestionData,
        { ...mockQuestionData, _id: "60d21b4667d0d8992e610c86" },
      ];

      (strategies.newest as jest.Mock).mockResolvedValue(questionsData);

      // Act
      await questionController.getQuestion(
        req as Request,
        res as Response,
        next
      );

      // Assert
      expect(strategies.newest).toHaveBeenCalled();
      expect(searchQuestion).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(questionsData);
      expect(next).not.toHaveBeenCalled();
    });

    it("should handle errors from searchQuestion", async () => {
      // Arrange
      req.query = {
        order: "newest",
        search: "javascript",
      };

      const questionsData = [
        mockQuestionData,
        { ...mockQuestionData, _id: "60d21b4667d0d8992e610c86" },
      ];

      (strategies.newest as jest.Mock).mockResolvedValue(questionsData);

      const error = new Error("Search error");
      (searchQuestion as jest.Mock).mockImplementation(() => {
        throw error;
      });

      // Act
      await questionController.getQuestion(
        req as Request,
        res as Response,
        next
      );

      // Assert
      expect(strategies.newest).toHaveBeenCalled();
      expect(searchQuestion).toHaveBeenCalledWith(questionsData, "javascript");
      expect(next).toHaveBeenCalledWith(error);
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });
  });
});
