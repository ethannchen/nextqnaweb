import { Request, Response } from "express";
import Answer from "../models/answers";
import User from "../models/users";

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
export const addAnswer = async (req: Request, res: Response) => {
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

/**
 * Toggles vote for an answer by the given user.
 *              If the user has already voted, it unvotes.
 *              If the user has not voted, it upvotes.
 * @returns {200} JSON response with the updated answer
 * @returns {400} JSON error if required fields are missing
 * @returns {404} If answer is not found
 * @returns {500} JSON error if there is an internal server error
 */
export const voteAnswer = async (req: Request, res: Response) => {
  const { aid } = req.params;
  const { email } = req.body;

  if (!email) {
    return res
      .status(400)
      .json({ message: "Missing user email in request body" });
  }

  const user = await User.findByEmail(email);
  if (!user) return res.status(400).json({ error: "Invalid user email" });

  try {
    const answer = await Answer.findById(aid);
    if (!answer) {
      return res.status(404).json({ message: "Answer not found" });
    }

    if (answer.hasUserVoted(email)) {
      await answer.unvote(email);
    } else {
      await answer.vote(email);
    }
    const convertedAnswer = { ...answer, _id: answer._id.toString() };
    res.status(200).json(convertedAnswer);
  } catch (err) {
    res.status(500).json({
      message: "Error processing vote",
      error: (err as Error).message,
    });
  }
};

/**
 * @route POST /answer/:aid/addComment
 * @description Adds a comment to an existing answer
 * @param {string} aid - The answer ID (in URL params)
 * @param {Object} comment - The comment object (in body)
 * @param {string} comment.text - The comment content
 * @param {string} comment.commented_by - The user id
 * @param {string} comment.comment_date_time - Timestamp for when the comment was made
 * @returns {200} JSON response with the updated answer
 * @returns {400} JSON error if required fields are missing
 * @returns {404} If answer is not found
 * @returns {500} JSON error if there is an internal server error
 */
export const addComment = async (req: Request, res: Response) => {
  const { aid } = req.params;
  const { text, commented_by, comment_date_time } = req.body;

  if (!text || !commented_by || !comment_date_time) {
    return res.status(400).json({ message: "Missing required comment fields" });
  }

  const user = await User.findById(commented_by);
  if (!user) return res.status(400).json({ error: "Invalid user" });

  try {
    const answer = await Answer.findById(aid);
    if (!answer) {
      return res.status(404).json({ message: "Answer not found" });
    }

    const comment = {
      text,
      commented_by: user._id,
      comment_date_time,
    };
    await answer.addComment(comment);

    const updatedAnswer = await Answer.findById(aid).populate(
      "comments.commented_by",
      "username"
    );

    console.log("updatedAnswer: ", updatedAnswer);
    res.status(200).json(updatedAnswer);
  } catch (err) {
    res.status(500).json({
      message: "Error adding comment",
      error: (err as Error).message,
    });
  }
};
