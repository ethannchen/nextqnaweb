import { Request, Response } from "express";
import Answer from "../models/answers";
import User from "../models/users";
import { BadRequestError, NotFoundError } from "../utils/errorUtils";
import asyncHandler from "express-async-handler";

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
export const addAnswer = asyncHandler(async (req: Request, res: Response) => {
  const { qid, ans } = req.body;

  if (!qid || !ans || !ans.text || !ans.ans_by || !ans.ans_date_time) {
    throw new BadRequestError("Missing required fields");
  }

  const response = await Answer.addAnswerToQuestion(qid, ans);
  res.status(200).json(response);
});

/**
 * Toggles vote for an answer by the given user.
 *              If the user has already voted, it unvotes.
 *              If the user has not voted, it upvotes.
 * @returns {200} JSON response with the updated answer
 * @returns {400} JSON error if required fields are missing
 * @returns {404} If answer is not found
 * @returns {500} JSON error if there is an internal server error
 */
export const voteAnswer = asyncHandler(async (req: Request, res: Response) => {
  const { aid } = req.params;
  const { email } = req.body;

  if (!email) {
    throw new BadRequestError("Missing user email in request body");
  }

  const user = await User.findByEmail(email);
  if (!user) {
    throw new BadRequestError("Invalid user email");
  }

  const answer = await Answer.findById(aid);
  if (!answer) {
    throw new NotFoundError("Answer not found");
  }

  if (answer.hasUserVoted(email)) {
    await answer.unvote(email);
  } else {
    await answer.vote(email);
  }

  const convertedAnswer = { ...answer, _id: answer._id.toString() };
  res.status(200).json(convertedAnswer);
});

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
export const addComment = asyncHandler(async (req: Request, res: Response) => {
  const { aid } = req.params;
  const { text, commented_by, comment_date_time } = req.body;

  if (!text || !commented_by || !comment_date_time) {
    throw new BadRequestError("Missing required comment fields");
  }

  const user = await User.findByEmail(commented_by);
  if (!user) {
    throw new BadRequestError("Invalid user email");
  }

  const answer = await Answer.findById(aid);
  if (!answer) {
    throw new NotFoundError("Answer not found");
  }

  await answer.addComment({
    text,
    commented_by: user._id,
    comment_date_time: new Date(comment_date_time),
  });

  const updatedAnswer = await Answer.findById(aid).populate(
    "comments.commented_by",
    "username"
  );

  if (!updatedAnswer) {
    throw new NotFoundError("Answer not found after comment");
  }

  res.status(200).json({ ...updatedAnswer, _id: updatedAnswer._id.toString() });
});
