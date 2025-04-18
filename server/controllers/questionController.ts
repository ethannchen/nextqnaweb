import { Request, Response } from "express";
import Question from "../models/questions";
import Tag from "../models/tags";
import { searchQuestion } from "../utils/searchQuestion";
import { strategies } from "../utils/sortQuestion";
import { BadRequestError, NotFoundError } from "../utils/errorUtils";
import asyncHandler from "express-async-handler";

/**
 * @route POST /addQuestion
 * @description Adds a new question to the database
 * @param {string} title - The title of the question
 * @param {string} text - The text content of the question
 * @param {Array<string>} tags - An array of tags associated with the question
 * @param {string} asked_by - The username of the person asking the question
 * @param {string} ask_date_time - The date and time when the question was asked
 * @returns {200} JSON response with the added question if successful
 * @returns {400} JSON error if required fields are missing
 * @returns {500} JSON error if there is an internal server error
 */
const addQuestion = asyncHandler(async (req: Request, res: Response) => {
  const { title, text, tags, asked_by, ask_date_time } = req.body;
  if (!title || !text || !tags || !asked_by || !ask_date_time) {
    throw new BadRequestError("Missing required fields");
  }

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
});

const getQuestionById = asyncHandler(async (req: Request, res: Response) => {
  const { qid } = req.params;
  const question = await Question.findByIdAndIncrementViews(qid);

  if (!question) {
    throw new NotFoundError("Question not found");
  }

  res.status(200).json(question);
});

const getQuestion = asyncHandler(async (req: Request, res: Response) => {
  const { order, search } = req.query;

  // Use a whitelist of allowed order values
  const allowedOrders = ["newest", "active", "unanswered"];

  const orderString = order?.toString() || "newest";
  const orderValue = allowedOrders.includes(orderString)
    ? orderString
    : "newest";

  const strategyFunction = strategies[orderValue];

  // sort questions
  let questions = await strategyFunction();

  // If search query is present, filter results
  if (questions && typeof search === "string" && search.trim() !== "") {
    questions = searchQuestion(questions, search);
  }

  res.status(200).json(questions);
});

export { addQuestion, getQuestion, getQuestionById };
