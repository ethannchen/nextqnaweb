import mongoose from "mongoose";
import Answer from "../models/answers";
import Question from "../models/questions";
import { MongoMemoryServer } from "mongodb-memory-server";

describe("Answer Schema Tests", () => {
  let mongoServer: MongoMemoryServer;

  // Setup in-memory database before tests
  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
  });

  // Close database connection after tests
  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  // Clear database between tests
  afterEach(async () => {
    await Answer.deleteMany({});
    if (mongoose.connection.db) {
      await mongoose.connection.db.dropDatabase();
    }
  });

  describe("Instance Methods", () => {
    describe("hasUserVoted", () => {
      it("should return true if user has voted", async () => {
        const answer = new Answer({
          text: "Test answer",
          ans_by: "test-user",
          ans_date_time: new Date(),
          votes: 1,
          voted_by: ["user1@test.com", "user2@test.com"],
        });

        const result = answer.hasUserVoted("user1@test.com");

        expect(result).toBe(true);
      });

      it("should return false if user has not voted", async () => {
        const answer = new Answer({
          text: "Test answer",
          ans_by: "test-user",
          ans_date_time: new Date(),
          votes: 1,
          voted_by: ["user1@test.com", "user2@test.com"],
        });

        const result = answer.hasUserVoted("user3@test.com");

        expect(result).toBe(false);
      });
    });

    describe("vote", () => {
      it("should add user to voted_by and increment votes if user hasn't voted", async () => {
        const answer = new Answer({
          text: "Test answer",
          ans_by: "test-user",
          ans_date_time: new Date(),
          votes: 1,
          voted_by: ["user1@test.com"],
        });
        await answer.save();

        await answer.vote("user2@test.com");

        expect(answer.votes).toBe(2);
        expect(answer.voted_by).toContain("user2@test.com");

        const savedAnswer = await Answer.findById(answer._id);
        expect(savedAnswer?.votes).toBe(2);
        expect(savedAnswer?.voted_by).toContain("user2@test.com");
      });

      it("should not change votes if user has already voted", async () => {
        const answer = new Answer({
          text: "Test answer",
          ans_by: "test-user",
          ans_date_time: new Date(),
          votes: 1,
          voted_by: ["user1@test.com"],
        });
        await answer.save();

        await answer.vote("user1@test.com");

        expect(answer.votes).toBe(1);
        expect(answer.voted_by).toEqual(["user1@test.com"]);

        const savedAnswer = await Answer.findById(answer._id);
        expect(savedAnswer?.votes).toBe(1);
        expect(savedAnswer?.voted_by).toEqual(["user1@test.com"]);
      });
    });

    describe("unvote", () => {
      it("should remove user from voted_by and decrement votes if user has voted", async () => {
        const answer = new Answer({
          text: "Test answer",
          ans_by: "test-user",
          ans_date_time: new Date(),
          votes: 2,
          voted_by: ["user1@test.com", "user2@test.com"],
        });
        await answer.save();

        await answer.unvote("user1@test.com");

        expect(answer.votes).toBe(1);
        expect(answer.voted_by).not.toContain("user1@test.com");

        const savedAnswer = await Answer.findById(answer._id);
        expect(savedAnswer?.votes).toBe(1);
        expect(savedAnswer?.voted_by).not.toContain("user1@test.com");
      });

      it("should not allow votes to go below 0", async () => {
        const answer = new Answer({
          text: "Test answer",
          ans_by: "test-user",
          ans_date_time: new Date(),
          votes: 0,
          voted_by: ["user1@test.com"],
        });
        await answer.save();

        await answer.unvote("user1@test.com");

        expect(answer.votes).toBe(0);
        expect(answer.voted_by).not.toContain("user1@test.com");
      });

      it("should not change anything if user has not voted", async () => {
        const answer = new Answer({
          text: "Test answer",
          ans_by: "test-user",
          ans_date_time: new Date(),
          votes: 1,
          voted_by: ["user1@test.com"],
        });
        await answer.save();

        await answer.unvote("user2@test.com");

        expect(answer.votes).toBe(1);
        expect(answer.voted_by).toEqual(["user1@test.com"]);
      });
    });

    describe("addComment", () => {
      it("should add a comment to the answer", async () => {
        const answer = new Answer({
          text: "Test answer",
          ans_by: "test-user",
          ans_date_time: new Date(),
          votes: 0,
          voted_by: [],
          comments: [],
        });
        await answer.save();

        const userId = new mongoose.Types.ObjectId();
        const comment = {
          text: "This is a test comment",
          commented_by: userId,
          comment_date_time: new Date(),
        };

        await answer.addComment(comment);

        expect(answer.comments.length).toBe(1);
        expect(answer.comments[0].text).toBe("This is a test comment");
        expect(answer.comments[0].commented_by.toString()).toBe(
          userId.toString()
        );

        const savedAnswer = await Answer.findById(answer._id);
        expect(savedAnswer?.comments.length).toBe(1);
        expect(savedAnswer?.comments[0].text).toBe("This is a test comment");
      });
    });
  });

  describe("Static Methods", () => {
    describe("getMostRecent", () => {
      it("should return answers sorted by date in descending order", async () => {
        const oldDate = new Date("2023-01-01");
        const newDate = new Date("2023-02-01");
        const newerDate = new Date("2023-03-01");

        const answer1 = await new Answer({
          text: "Answer 1",
          ans_by: "user1",
          ans_date_time: oldDate,
          votes: 0,
          voted_by: [],
        }).save();

        const answer2 = await new Answer({
          text: "Answer 2",
          ans_by: "user2",
          ans_date_time: newerDate,
          votes: 0,
          voted_by: [],
        }).save();

        const answer3 = await new Answer({
          text: "Answer 3",
          ans_by: "user3",
          ans_date_time: newDate,
          votes: 0,
          voted_by: [],
        }).save();

        const results = await Answer.getMostRecent([
          answer1._id,
          answer2._id,
          answer3._id,
        ]);

        expect(results.length).toBe(3);
        expect(results[0]._id.toString()).toBe(answer2._id.toString()); // newest first
        expect(results[1]._id.toString()).toBe(answer3._id.toString());
        expect(results[2]._id.toString()).toBe(answer1._id.toString());
      });

      it("should return empty array if no answers match", async () => {
        const nonExistentId = new mongoose.Types.ObjectId();
        const results = await Answer.getMostRecent([nonExistentId]);
        expect(results).toEqual([]);
      });
    });

    describe("getLatestAnswerDate", () => {
      it("should return the latest date from a list of answers", async () => {
        const oldDate = new Date("2023-01-01");
        const newDate = new Date("2023-02-01");
        const newestDate = new Date("2023-03-01");

        const answers = [
          { ans_date_time: oldDate },
          { ans_date_time: newestDate },
          { ans_date_time: newDate },
        ];

        const result = await Answer.getLatestAnswerDate(answers);

        expect(result).toEqual(newestDate);
      });

      it("should return undefined for empty array", async () => {
        const result = await Answer.getLatestAnswerDate([]);

        expect(result).toBeUndefined();
      });

      it("should filter out objects that don't conform to IAnswerDB", async () => {
        const validDate = new Date("2023-01-01");
        const answers = [
          { ans_date_time: validDate },
          { text: "Not a valid answer object" },
        ];

        const result = await Answer.getLatestAnswerDate(answers);

        expect(result).toEqual(validDate);
      });
    });

    describe("addAnswerToQuestion", () => {
      it("should add an answer to a question", async () => {
        const mockQuestion = {
          _id: new mongoose.Types.ObjectId(),
          addAnswer: jest.fn(),
          save: jest.fn(),
        };

        Question.findById = jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue(mockQuestion),
        });

        const qid = mockQuestion._id.toString();
        const answerData = {
          text: "New answer",
          ans_by: "test-user",
          ans_date_time: new Date().toISOString(),
          votes: 0,
          voted_by: [],
          comments: [],
        };

        const result = await Answer.addAnswerToQuestion(qid, answerData);

        expect(Question.findById).toHaveBeenCalledWith(qid);
        expect(mockQuestion.addAnswer).toHaveBeenCalled();
        expect(mockQuestion.save).toHaveBeenCalled();
        expect(result.text).toBe(answerData.text);
        expect(result.ans_by).toBe(answerData.ans_by);

        const savedAnswers = await Answer.find({});
        expect(savedAnswers.length).toBe(1);
        expect(savedAnswers[0].text).toBe(answerData.text);
      });

      it("should throw an error if question is not found", async () => {
        Question.findById = jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue(null),
        });

        const qid = new mongoose.Types.ObjectId().toString();
        const answerData = {
          text: "New answer",
          ans_by: "test-user",
          ans_date_time: new Date().toISOString(),
          votes: 0,
          voted_by: [],
          comments: [],
        };

        await expect(
          Answer.addAnswerToQuestion(qid, answerData)
        ).rejects.toThrow("Question not found");
      });
    });
  });
});
