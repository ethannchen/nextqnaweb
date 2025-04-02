import express, { Request, Response } from "express";
import Question from "../models/questions";
import Tag from "../models/tags";
import { searchQuestion } from "../utils/searchQuestion";
import { strategies } from "../utils/sortQuestion";

const router = express.Router();

/**
 * @route POST /addQuestion
 * @description Adds a new question to the database
 * @param {string} title - The title of the question
 * @param {string} text - The body text of the question
 * @param {Array<string>} tags - Array of tag names associated with the question
 * @param {string} asked_by - The username of the person asking the question
 * @param {string} ask_date_time - The date and time when the question was asked
 * @returns {200} JSON response with the created question
 * @returns {400} JSON error if required fields are missing
 * @returns {500} JSON error if there is an internal server error
 */
router.post("/addQuestion", async (req: Request, res: Response) => {
  const { title, text, tags, asked_by, ask_date_time } = req.body;
  if (!title || !text || !tags || !asked_by || !ask_date_time) {
    return res.status(400).json({ message: "Missing required fields" });
  }
  try {
    const tagsToAdd = await Tag.getTags(tags);
    const questionToAdd = {
      title,
      text,
      tags: tagsToAdd,
      asked_by,
      ask_date_time,
      views: 0,
      answers: [],
      mostRecentActivity: new Date(ask_date_time),
    };
    const response = await Question.addQuestion(questionToAdd);
    res.status(200).json(response);
  } catch (err) {
    res.status(500).send("Error adding question: " + (err as Error).message);
  }
});

/**
 * @route GET /getQuestionById/:qid
 * @description Retrieves a question by its ID and increments its view count
 * @param {string} qid - The question ID
 * @returns {200} JSON response with the question details
 * @returns {400} JSON error if question is not found
 * @returns {500} JSON error if there is an internal server error
 */
router.get("/getQuestionById/:qid", async (req: Request, res: Response) => {
  const { qid } = req.params;
  try {
    const question = await Question.findByIdAndIncrementViews(qid);
    if (!question) {
      res.status(400).json({ message: "Question not found" });
    }
    res.status(200).json(question);
  } catch (err) {
    res
      .status(500)
      .send("Error retrieving question: " + (err as Error).message);
  }
});

/**
 * @route GET /getQuestion
 * @description Retrieves a list of questions, optionally filtered by search query and sorted by order
 * @param {string} [order] - The sorting strategy (e.g., "newest", "active")
 * @param {string} [search] - Optional search text to filter questions
 * @returns {200} JSON response with the list of questions
 * @returns {400} JSON error if invalid order is provided
 * @returns {500} JSON error if there is an internal server error
 */
router.get("/getQuestion", async (req: Request, res: Response) => {
  const { order, search } = req.query;
  try {
    const strategyFunction = strategies[order?.toString() || "newest"];

    if (!strategyFunction) {
      return res.status(400).json({ message: "Invalid order" });
    }

    // sort questions
    let questions = await strategyFunction();

    // If search query is present, filter results
    if (questions && typeof search === "string" && search.trim() !== "") {
      questions = searchQuestion(questions, search);
    }
    res.status(200).json(questions);
  } catch (err) {
    res
      .status(500)
      .send("Error retrieving question: " + (err as Error).message);
  }
});

export default router;
