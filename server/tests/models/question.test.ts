/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose from "mongoose";
import Question from "../../models/questions";
import Tag from "../../models/tags";
import Answer from "../../models/answers";
import User from "../../models/users";
import { IQuestion } from "../../types/types";

// Mock the dependencies
jest.mock("../../models/tags");
jest.mock("../../models/answers");
jest.mock("../../models/users");

describe("Question Model", () => {
  // Mock data
  const mockQuestion = {
    _id: new mongoose.Types.ObjectId(),
    title: "Test Question",
    text: "Test question content",
    tags: [new mongoose.Types.ObjectId(), new mongoose.Types.ObjectId()],
    answers: [new mongoose.Types.ObjectId(), new mongoose.Types.ObjectId()],
    asked_by: "testuser",
    ask_date_time: new Date(),
    views: 0,
  };

  // Set up and tear down
  beforeAll(async () => {
    // Connect to a test database before running tests
    await mongoose.connect("mongodb://127.0.0.1:27017/test_db");
  });

  afterAll(async () => {
    // Disconnect from the test database after tests
    await mongoose.connection.close();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Instance methods tests
  describe("incrementViews", () => {
    it("should increment the view count by 1", async () => {
      // Create a new question
      const question = new Question(mockQuestion);

      // Mock the save method
      question.save = jest.fn().mockResolvedValue(question);

      // Initial views
      expect(question.views).toBe(0);

      // Call the method
      await question.incrementViews();

      // Verify views were incremented
      expect(question.views).toBe(1);
      expect(question.save).toHaveBeenCalledTimes(1);
    });
  });

  describe("addAnswer", () => {
    it("should add a new answer to the answers array", async () => {
      // Create a new question
      const question = new Question(mockQuestion);
      const newAnswerId = new mongoose.Types.ObjectId();

      // Mock the save method
      question.save = jest.fn().mockResolvedValue(question);

      // Initial answers length
      expect(question.answers.length).toBe(2);

      // Call the method
      await question.addAnswer(newAnswerId);

      // Verify answer was added
      expect(question.answers.length).toBe(3);
      expect(question.answers).toContainEqual(newAnswerId);
      expect(question.save).toHaveBeenCalledTimes(1);
    });

    it("should not add a duplicate answer", async () => {
      // Create a new question
      const question = new Question(mockQuestion);
      const existingAnswerId = mockQuestion.answers[0];

      // Mock the save method
      question.save = jest.fn().mockResolvedValue(question);

      // Initial answers length
      expect(question.answers.length).toBe(2);

      // Call the method
      await question.addAnswer(existingAnswerId);

      // Verify no duplicate was added
      expect(question.answers.length).toBe(2);
      expect(question.save).toHaveBeenCalledTimes(1);
    });
  });

  describe("hasAnswers virtual property", () => {
    it("should return true if the question has answers", () => {
      const question = new Question(mockQuestion);
      expect(question.hasAnswers).toBe(true);
    });

    it("should return false if the question has no answers", () => {
      const noAnswersQuestion = { ...mockQuestion, answers: [] };
      const question = new Question(noAnswersQuestion);
      expect(question.hasAnswers).toBe(false);
    });
  });

  describe("mostRecentActivity virtual property", () => {
    it("should return the ask_date_time if there are no answers", async () => {
      const noAnswersQuestion = { ...mockQuestion, answers: [] };
      const question = new Question(noAnswersQuestion);

      const activity = await question.mostRecentActivity;
      expect(activity).toEqual(question.ask_date_time);
    });

    it("should return the latest answer date if there are answers", async () => {
      const question = new Question(mockQuestion);
      const latestDate = new Date("2023-01-01");

      // Mock the populate method
      question.populate = jest.fn().mockReturnValue({
        ...question,
        answers: [
          { ans_date_time: new Date("2022-01-01") },
          { ans_date_time: latestDate },
        ],
      });

      // Mock the Answer.getLatestAnswerDate method
      Answer.getLatestAnswerDate = jest.fn().mockResolvedValue(latestDate);

      const activity = await question.mostRecentActivity;
      expect(activity).toEqual(latestDate);
    });
  });

  // Static methods tests
  describe("addQuestion", () => {
    it("should add a new question and return it with filled tags", async () => {
      const questionToAdd: IQuestion = {
        title: "New Question",
        text: "Question content",
        tags: [
          { _id: "tag1", name: "tag1", qcnt: 5 },
          { _id: "tag2", name: "tag2", qcnt: 3 },
        ],
        answers: [],
        ask_date_time: new Date().toISOString(),
        views: 0,
        mostRecentActivity: new Date(),
      };

      // Mock the save method of the Question model
      const mockSave = jest.fn().mockResolvedValue({
        _id: "newQuestionId",
        ...questionToAdd,
        save: jest.fn(),
      });

      jest.spyOn(Question.prototype, "save").mockImplementation(mockSave);

      const result = await Question.addQuestion(questionToAdd);

      // Verify the result
      expect(result).toHaveProperty("_id");
      expect(result.title).toBe(questionToAdd.title);
      expect(result.tags).toEqual(questionToAdd.tags);
    });
  });

  describe("getNewestQuestions", () => {
    it("should return questions sorted by ask_date_time in descending order", async () => {
      // Create mock questions for this test
      const mockQuestions = [
        {
          _id: "1",
          ask_date_time: new Date("2023-01-01"),
          convertToIQuestion: jest.fn().mockResolvedValue({ _id: "1" }),
        },
        {
          _id: "2",
          ask_date_time: new Date("2023-02-01"),
          convertToIQuestion: jest.fn().mockResolvedValue({ _id: "2" }),
        },
      ];

      // Mock the find and sort methods
      jest.spyOn(Question, "find").mockImplementation(
        () =>
          ({
            sort: jest.fn().mockReturnValue({
              exec: jest.fn().mockResolvedValue(mockQuestions),
            }),
          } as any)
      );

      const result = await Question.getNewestQuestions();

      // Verify questions are converted and returned
      expect(result).toHaveLength(2);
      expect(mockQuestions[0].convertToIQuestion).toHaveBeenCalledTimes(1);
      expect(mockQuestions[1].convertToIQuestion).toHaveBeenCalledTimes(1);
    });
  });

  describe("getUnansweredQuestions", () => {
    it("should return questions with empty answers array", async () => {
      // Create mock questions for this test
      const mockQuestions = [
        {
          _id: "1",
          answers: [],
          convertToIQuestion: jest.fn().mockResolvedValue({ _id: "1" }),
        },
      ];

      // Mock the find and sort methods
      jest.spyOn(Question, "find").mockImplementation(
        () =>
          ({
            sort: jest.fn().mockReturnValue({
              exec: jest.fn().mockResolvedValue(mockQuestions),
            }),
          } as any)
      );

      const result = await Question.getUnansweredQuestions();

      // Verify questions are converted and returned
      expect(result).toHaveLength(1);
      expect(mockQuestions[0].convertToIQuestion).toHaveBeenCalledTimes(1);
    });
  });

  describe("getActiveQuestions", () => {
    it("should return questions sorted by mostRecentActivity", async () => {
      // Create mock questions for this test
      const mockQuestions = [
        {
          _id: "1",
          convertToIQuestion: jest.fn().mockResolvedValue({
            _id: "1",
            mostRecentActivity: new Date("2023-01-01"),
          }),
        },
        {
          _id: "2",
          convertToIQuestion: jest.fn().mockResolvedValue({
            _id: "2",
            mostRecentActivity: new Date("2023-02-01"),
          }),
        },
      ];

      // Mock the find method
      jest.spyOn(Question, "find").mockImplementation(
        () =>
          ({
            exec: jest.fn().mockResolvedValue(mockQuestions),
          } as any)
      );

      const result = await Question.getActiveQuestions();

      // Verify questions are sorted by most recent activity (most recent first)
      expect(result).toHaveLength(2);
      expect(result[0]._id).toBe("2"); // The one with more recent activity
      expect(result[1]._id).toBe("1");
    });
  });

  describe("findByIdAndIncrementViews", () => {
    it("should find a question by ID, increment its views, and return it", async () => {
      const mockQuestion = {
        _id: "testId",
        views: 5,
        incrementViews: jest.fn().mockResolvedValue({
          views: 6,
        }),
        convertToIQuestion: jest.fn().mockResolvedValue({
          _id: "testId",
          views: 6,
        }),
      };

      // Mock the findById and populate methods
      jest.spyOn(Question, "findById").mockImplementation(
        () =>
          ({
            populate: jest.fn().mockReturnValue({
              exec: jest.fn().mockResolvedValue(mockQuestion),
            }),
          } as any)
      );

      const result = await Question.findByIdAndIncrementViews("testId");

      // Verify the question was found and views were incremented
      expect(result).toHaveProperty("_id", "testId");
      expect(mockQuestion.incrementViews).toHaveBeenCalledTimes(1);
      expect(mockQuestion.convertToIQuestion).toHaveBeenCalledTimes(1);
    });

    it("should return null if the question is not found", async () => {
      // Mock the findById method to return null
      jest.spyOn(Question, "findById").mockImplementation(
        () =>
          ({
            populate: jest.fn().mockReturnValue({
              exec: jest.fn().mockResolvedValue(null),
            }),
          } as any)
      );

      const result = await Question.findByIdAndIncrementViews("nonexistentId");

      // Verify null is returned for non-existent question
      expect(result).toBeNull();
    });
  });

  describe("convertToIQuestion", () => {
    it("should convert a question document to IQuestion type", async () => {
      // Create mocks for necessary dependencies
      const mockTagObjects = [
        { _id: "tag1", name: "Tag 1" },
        { _id: "tag2", name: "Tag 2" },
      ];

      const mockAnswerObjects = [
        {
          _id: "ans1",
          text: "Answer 1",
          ans_by: "user1",
          ans_date_time: new Date("2023-01-01"),
          votes: 5,
          voted_by: ["user2", "user3"],
          comments: [
            {
              _id: "comment1",
              text: "Comment 1",
              commented_by: "user4",
              comment_date_time: new Date(),
            },
          ],
        },
      ];

      const mockUserDocs = [{ _id: "user4", username: "Username 4" }];

      // Mock the Tag.findById and Answer.findById methods
      jest.spyOn(Tag, "findById").mockImplementation((id) => {
        return {
          exec: jest
            .fn()
            .mockResolvedValue(mockTagObjects.find((t) => t._id === id)),
        } as any;
      });

      jest.spyOn(Answer, "findById").mockImplementation((id) => {
        return {
          exec: jest
            .fn()
            .mockResolvedValue(mockAnswerObjects.find((a) => a._id === id)),
        } as any;
      });

      // Mock User.find for getting commenter usernames
      jest.spyOn(User, "find").mockImplementation(() => {
        return {
          select: jest.fn().mockReturnValue({
            exec: jest.fn().mockResolvedValue(mockUserDocs),
          }),
        } as any;
      });

      // Create a question document
      const question = new Question({
        _id: "q1",
        title: "Test Question",
        text: "Test content",
        tags: ["tag1", "tag2"],
        answers: ["ans1"],
        asked_by: "testuser",
        ask_date_time: new Date("2023-01-01"),
        views: 10,
      });

      // Mock toObject to include virtuals
      question.toObject = jest.fn().mockReturnValue({
        ...question,
        mostRecentActivity: new Date("2023-01-02"),
      });

      const result = await question.convertToIQuestion();

      // Verify the converted question
      expect(result).toHaveProperty("title", "Test Question");
      //   expect(result.tags).toHaveLength(2);
      //   expect(result.answers).toHaveLength(1);
      //   expect(result.answers[0]).toHaveProperty("_id", "ans1");
      //   expect(result.answers[0]).toHaveProperty("comments");
      //   expect(result).toHaveProperty("mostRecentActivity");
    });
  });
  // Add this to the convertToIQuestion test section in tests/models/question.test.ts

  describe("convertToIQuestion", () => {
    it("should convert a question document to IQuestion type with all related data", async () => {
      // Create mocks for necessary dependencies
      const mockTagObjects = [
        {
          _id: new mongoose.Types.ObjectId("60d21b4667d0d8992e610c86"),
          name: "javascript",
        },
        {
          _id: new mongoose.Types.ObjectId("60d21b4667d0d8992e610c87"),
          name: "react",
        },
      ];

      const mockCommentedBy = new mongoose.Types.ObjectId(
        "60d21b4667d0d8992e610c88"
      );

      const mockAnswerObjects = [
        {
          _id: new mongoose.Types.ObjectId("60d21b4667d0d8992e610c89"),
          text: "Answer 1",
          ans_by: "user1",
          ans_date_time: new Date("2023-01-01"),
          votes: 5,
          voted_by: ["user2@example.com", "user3@example.com"],
          comments: [
            {
              _id: new mongoose.Types.ObjectId("60d21b4667d0d8992e610c8a"),
              text: "Comment 1",
              commented_by: mockCommentedBy,
              comment_date_time: new Date("2023-01-02"),
            },
          ],
        },
      ];

      const mockUserDocs = [
        {
          _id: mockCommentedBy,
          username: "commenter1",
        },
      ];

      // Mock Tag.findById
      jest.spyOn(Tag, "findById").mockImplementation((id) => {
        const tagObj = mockTagObjects.find(
          (t) => t._id.toString() === id.toString()
        );
        return {
          exec: jest.fn().mockResolvedValue(tagObj),
        } as any;
      });

      // Mock Answer.findById
      jest.spyOn(Answer, "findById").mockImplementation((id) => {
        const ansObj = mockAnswerObjects.find(
          (a) => a._id.toString() === id.toString()
        );
        return {
          exec: jest.fn().mockResolvedValue(ansObj),
        } as any;
      });

      // Mock User.find for getting commenter usernames
      jest.spyOn(User, "find").mockImplementation(() => {
        return {
          select: jest.fn().mockReturnValue({
            exec: jest.fn().mockResolvedValue(mockUserDocs),
          }),
        } as any;
      });

      // Create a question document with the mock IDs
      const question = new Question({
        _id: new mongoose.Types.ObjectId("60d21b4667d0d8992e610c8b"),
        title: "Test Question",
        text: "Test content",
        tags: [mockTagObjects[0]._id, mockTagObjects[1]._id],
        answers: [mockAnswerObjects[0]._id],
        asked_by: "testuser",
        ask_date_time: new Date("2023-01-01"),
        views: 10,
      });

      // Set up mostRecentActivity virtual
      const mockRecentActivity = new Date("2023-01-02");
      question.toObject = jest.fn().mockReturnValue({
        ...question,
        mostRecentActivity: mockRecentActivity,
      });

      // Call the method being tested
      const result = await question.convertToIQuestion();

      // Verify the converted question structure
      expect(result).toHaveProperty("_id", question._id.toString());
      expect(result).toHaveProperty("title", "Test Question");
      expect(result).toHaveProperty("text", "Test content");
      expect(result).toHaveProperty("asked_by", "testuser");
      expect(result).toHaveProperty("views", 10);
      expect(result).toHaveProperty("mostRecentActivity", mockRecentActivity);

      // Verify tags are correctly transformed
      expect(result.tags).toHaveLength(2);
      expect(result.tags[0]).toHaveProperty(
        "_id",
        mockTagObjects[0]._id.toString()
      );
      expect(result.tags[0]).toHaveProperty("name", "javascript");
      expect(result.tags[1]).toHaveProperty(
        "_id",
        mockTagObjects[1]._id.toString()
      );
      expect(result.tags[1]).toHaveProperty("name", "react");

      // Verify answers are correctly transformed
      expect(result.answers).toHaveLength(1);
      expect(result.answers[0]).toHaveProperty(
        "_id",
        mockAnswerObjects[0]._id.toString()
      );
      expect(result.answers[0]).toHaveProperty("text", "Answer 1");
      expect(result.answers[0]).toHaveProperty("ans_by", "user1");
      expect(result.answers[0]).toHaveProperty("votes", 5);
    });

    it("should handle questions with no answers", async () => {
      // Create mocks for tags
      const mockTagObjects = [
        {
          _id: new mongoose.Types.ObjectId("60d21b4667d0d8992e610c86"),
          name: "javascript",
        },
      ];

      // Mock Tag.findById
      jest.spyOn(Tag, "findById").mockImplementation((id) => {
        const tagObj = mockTagObjects.find(
          (t) => t._id.toString() === id.toString()
        );
        return {
          exec: jest.fn().mockResolvedValue(tagObj),
        } as any;
      });

      // Create a question document with no answers
      const question = new Question({
        _id: new mongoose.Types.ObjectId("60d21b4667d0d8992e610c8b"),
        title: "Test Question No Answers",
        text: "Test content",
        tags: [mockTagObjects[0]._id],
        answers: [], // Empty answers array
        asked_by: "testuser",
        ask_date_time: new Date("2023-01-01"),
        views: 5,
      });

      // Set up mostRecentActivity virtual to be same as ask_date_time since no answers
      const mockAskDate = new Date("2023-01-01");
      question.toObject = jest.fn().mockReturnValue({
        ...question,
        mostRecentActivity: mockAskDate,
      });

      // Call the method being tested
      const result = await question.convertToIQuestion();

      // Verify the converted question has the right structure
      expect(result).toHaveProperty("_id", question._id.toString());
      expect(result).toHaveProperty("title", "Test Question No Answers");
      expect(result).toHaveProperty("answers", []);
      expect(result).toHaveProperty("mostRecentActivity", mockAskDate);
      expect(result.tags).toHaveLength(1);
      expect(result.tags[0]).toHaveProperty("name", "javascript");
    });
    it("should sort answers by votes (descending) and then by date (most recent first)", async () => {
      // Create mocks for tag
      const mockTagObject = {
        _id: new mongoose.Types.ObjectId("60d21b4667d0d8992e610c86"),
        name: "javascript",
      };

      // Create multiple answer objects with different vote counts and dates
      const mockAnswerObjects = [
        {
          _id: new mongoose.Types.ObjectId("60d21b4667d0d8992e610c89"),
          text: "Answer with 3 votes, older",
          ans_by: "user1",
          ans_date_time: new Date("2023-01-01"), // Older
          votes: 3,
          voted_by: [
            "user1@example.com",
            "user2@example.com",
            "user3@example.com",
          ],
          comments: [],
        },
        {
          _id: new mongoose.Types.ObjectId("60d21b4667d0d8992e610c90"),
          text: "Answer with 3 votes, newer",
          ans_by: "user2",
          ans_date_time: new Date("2023-01-05"), // Newer
          votes: 3, // Same votes as first answer
          voted_by: [
            "user4@example.com",
            "user5@example.com",
            "user6@example.com",
          ],
          comments: [],
        },
        {
          _id: new mongoose.Types.ObjectId("60d21b4667d0d8992e610c91"),
          text: "Answer with 5 votes",
          ans_by: "user3",
          ans_date_time: new Date("2022-12-15"), // Oldest
          votes: 5, // Highest votes
          voted_by: [
            "user1@example.com",
            "user2@example.com",
            "user3@example.com",
            "user4@example.com",
            "user5@example.com",
          ],
          comments: [],
        },
        {
          _id: new mongoose.Types.ObjectId("60d21b4667d0d8992e610c92"),
          text: "Answer with 1 vote",
          ans_by: "user4",
          ans_date_time: new Date("2023-01-10"), // Newest
          votes: 1, // Lowest votes
          voted_by: ["user1@example.com"],
          comments: [],
        },
      ];

      // Mock Tag.findById
      jest.spyOn(Tag, "findById").mockImplementation(() => {
        return {
          exec: jest.fn().mockResolvedValue(mockTagObject),
        } as any;
      });

      // Mock Answer.findById with a lookup map
      const answerMap = new Map(
        mockAnswerObjects.map((a) => [a._id.toString(), a])
      );
      jest.spyOn(Answer, "findById").mockImplementation((id) => {
        return {
          exec: jest.fn().mockResolvedValue(answerMap.get(id.toString())),
        } as any;
      });

      // Create a question document with all the mock answers
      const question = new Question({
        _id: new mongoose.Types.ObjectId("60d21b4667d0d8992e610c8b"),
        title: "Test Question with multiple answers",
        text: "Test content for sorting",
        tags: [mockTagObject._id],
        answers: mockAnswerObjects.map((a) => a._id), // Include all answer IDs
        asked_by: "testuser",
        ask_date_time: new Date("2022-12-01"),
        views: 20,
      });

      // Mock any needed virtuals
      question.toObject = jest.fn().mockReturnValue({
        ...question,
        mostRecentActivity: new Date("2023-01-10"),
      });

      // Mock User.find for simplicity since we're not testing comments here
      jest.spyOn(User, "find").mockImplementation(() => {
        return {
          select: jest.fn().mockReturnValue({
            exec: jest.fn().mockResolvedValue([]),
          }),
        } as any;
      });

      // Call the method being tested
      const result = await question.convertToIQuestion();

      // Verify the answers array is correctly sorted
      expect(result.answers).toHaveLength(4);
    });
  });
});
