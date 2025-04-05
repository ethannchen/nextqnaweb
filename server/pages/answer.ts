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

/**
 * @route PATCH /:aid/vote
 * @description Toggles vote for an answer by the given user.
 *              If the user has already voted, it unvotes.
 *              If the user has not voted, it upvotes.
 * @param {string} aid - Answer ID (in URL path)
 * @param {string} user - Username of the voter (in request body)
 * @returns {200} JSON response with the updated answer
 * @returns {400} JSON error if required fields are missing
 * @returns {404} If answer is not found
 * @returns {500} JSON error if there is an internal server error
 */
router.patch("/:aid/vote", async (req: Request, res: Response) => {
  const { aid } = req.params;
  const { user } = req.body;

  if (!user) {
    return res.status(400).json({ message: "Missing user in request body" });
  }

  try {
    const answer = await Answer.findById(aid);
    if (!answer) {
      return res.status(404).json({ message: "Answer not found" });
    }

    if (answer.hasUserVoted(user)) {
      await answer.unvote(user);
    } else {
      await answer.vote(user);
    }

    res.status(200).json(answer);
  } catch (err) {
    res.status(500).json({
      message: "Error processing vote",
      error: (err as Error).message,
    });
  }
});

export default router;
