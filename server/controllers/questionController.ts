import { Request, Response } from "express";
import Question from "../models/questions";
import Tag from "../models/tags";
import { searchQuestion } from "../utils/searchQuestion";
import { strategies } from "../utils/sortQuestion";

const addQuestion = async (req: Request, res: Response) => {
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
};

const getQuestionById = async (req: Request, res: Response) => {
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
};

const getQuestion = async (req: Request, res: Response) => {
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
};

export { addQuestion, getQuestion, getQuestionById };
