import {
  addAnswer,
  voteAnswer,
  addComment,
} from "../controllers/answerController";
import Answer from "../models/answers";
import User from "../models/users";
import { BadRequestError, NotFoundError } from "../utils/errorUtils";

// Mock dependencies
jest.mock("../models/answers");
jest.mock("../../models/users");

const mockResponse = () => {
  const res: any = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe("Answer Controller", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("addAnswer", () => {
    it("should return 400 if required fields are missing", async () => {
      const req: any = { body: { qid: "", ans: {} } };
      const res = mockResponse();

      await expect(addAnswer(req, res, jest.fn())).rejects.toThrow(
        BadRequestError
      );
    });

    it("should call Answer.addAnswerToQuestion and return 200", async () => {
      const req: any = {
        body: {
          qid: "qid123",
          ans: {
            text: "Test answer",
            ans_by: "user1",
            ans_date_time: "2024-01-01",
          },
        },
      };
      const res = mockResponse();
      (Answer.addAnswerToQuestion as jest.Mock).mockResolvedValue(
        "mockedAnswer"
      );

      await addAnswer(req, res, jest.fn());

      expect(Answer.addAnswerToQuestion).toHaveBeenCalledWith(
        "qid123",
        req.body.ans
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith("mockedAnswer");
    });
  });

  describe("voteAnswer", () => {
    const req: any = {
      params: { aid: "answer123" },
      body: { email: "test@example.com" },
    };
    const res = mockResponse();

    it("should return 400 if email is missing", async () => {
      const invalidReq: any = { ...req, body: {} };
      await expect(voteAnswer(invalidReq, res, jest.fn())).rejects.toThrow(
        BadRequestError
      );
    });

    it("should return 400 if user is not found", async () => {
      (User.findByEmail as jest.Mock).mockResolvedValue(null);
      await expect(voteAnswer(req, res, jest.fn())).rejects.toThrow(
        BadRequestError
      );
    });

    it("should return 404 if answer not found", async () => {
      (User.findByEmail as jest.Mock).mockResolvedValue({ _id: "u1" });
      (Answer.findById as jest.Mock).mockResolvedValue(null);
      await expect(voteAnswer(req, res, jest.fn())).rejects.toThrow(
        NotFoundError
      );
    });

    it("should unvote if already voted", async () => {
      const mockAnswer = {
        _id: "answer123",
        hasUserVoted: jest.fn().mockReturnValue(true),
        unvote: jest.fn(),
      };
      (User.findByEmail as jest.Mock).mockResolvedValue({ _id: "u1" });
      (Answer.findById as jest.Mock).mockResolvedValue(mockAnswer);

      await voteAnswer(req, res, jest.fn());

      expect(mockAnswer.unvote).toHaveBeenCalledWith("test@example.com");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        ...mockAnswer,
        _id: "answer123",
      });
    });

    it("should vote if not yet voted", async () => {
      const mockAnswer = {
        _id: "answer123",
        hasUserVoted: jest.fn().mockReturnValue(false),
        vote: jest.fn(),
      };
      (User.findByEmail as jest.Mock).mockResolvedValue({ _id: "u1" });
      (Answer.findById as jest.Mock).mockResolvedValue(mockAnswer);

      await voteAnswer(req, res, jest.fn());

      expect(mockAnswer.vote).toHaveBeenCalledWith("test@example.com");
      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  describe("addComment", () => {
    const req: any = {
      params: { aid: "a1" },
      body: {
        text: "Nice!",
        commented_by: "test@example.com",
        comment_date_time: "2024-01-01",
      },
    };
    const res = mockResponse();

    it("should return 400 if required comment fields are missing", async () => {
      const badReq: any = { ...req, body: {} };
      await addComment(badReq, res, jest.fn());
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it("should return 400 if user is not found", async () => {
      (User.findByEmail as jest.Mock).mockResolvedValue(null);
      await addComment(req, res, jest.fn());
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it("should return 404 if answer not found", async () => {
      (User.findByEmail as jest.Mock).mockResolvedValue({ _id: "u1" });
      (Answer.findById as jest.Mock).mockResolvedValue(null);
      await addComment(req, res, jest.fn());
      expect(res.status).toHaveBeenCalledWith(404);
    });

    it("should add comment and return updated answer", async () => {
      const mockAnswer = {
        _id: "a1",
        addComment: jest.fn(),
      };
      const populatedAnswer = {
        _id: "a1",
        comments: [],
        populate: jest.fn().mockReturnThis(),
      };
      (User.findByEmail as jest.Mock).mockResolvedValue({ _id: "u1" });
      (Answer.findById as jest.Mock)
        .mockResolvedValueOnce(mockAnswer)
        .mockResolvedValueOnce(populatedAnswer);

      await addComment(req, res, jest.fn());

      expect(mockAnswer.addComment).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ ...populatedAnswer, _id: "a1" });
    });
  });
});
