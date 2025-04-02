import express, { Request, Response } from "express";
import Answer from "../models/answers";

const router = express.Router();

/**
 * @route POST /addAnswer
 * @description Adds a new answer to an existing question
 * @param {string} qid - The question ID
 * @param {Object} ans - The answer object
 * @param {string} ans.text - The text content of the answer
 * @param {string} ans.ans_by - The username of the person answering
 * @param {string} ans.ans_date_time - The date and time when the answer was posted
 * @returns {200} JSON response with the added answer if successful
 * @returns {400} JSON error if required fields are missing
 * @returns {500} JSON error if there is an internal server error
 */
router.post("/addAnswer", async (req: Request, res: Response) => {
  const { qid, ans } = req.body;
  if (!qid || !ans || !ans.text || !ans.ans_by || !ans.ans_date_time) {
    return res.status(400).json({ message: "Missing required fields" });
  }
  try {
    const response = await Answer.addAnswerToQuestion(qid, ans);
    res.status(200).json(response);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error adding answer", error: (err as Error).message });
  }
});

export default router;
