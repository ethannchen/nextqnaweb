import { Request, Response } from "express";
import Question from "../models/questions";
import Tag from "../models/tags";
import { searchQuestion } from "../utils/searchQuestion";
import { strategies } from "../utils/sortQuestion";
import { BadRequestError, NotFoundError } from "../utils/errorUtils";
import asyncHandler from "express-async-handler";

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
  const strategyFunction = strategies[order?.toString() || "newest"];

  if (!strategyFunction) {
    throw new BadRequestError("Invalid order");
  }

  // sort questions
  let questions = await strategyFunction();

  // If search query is present, filter results
  if (questions && typeof search === "string" && search.trim() !== "") {
    questions = searchQuestion(questions, search);
  }

  res.status(200).json(questions);
});

export { addQuestion, getQuestion, getQuestionById };
