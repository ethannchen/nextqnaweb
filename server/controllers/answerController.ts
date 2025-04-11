import { Request, Response } from "express";
import Answer from "../models/answers";

const addAnswer = async (req: Request, res: Response) => {
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
};

export { addAnswer };
