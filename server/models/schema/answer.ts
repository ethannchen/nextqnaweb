import mongoose from "mongoose";
import { IAnswerDB } from "../../scripts/script_types";
import { IAnswer, IAnswerDocument, IAnswerModel } from "../../types/types";
import Question from "../questions";

/**
 * Sub-schema for comment documents embedded within answers
 *
 * @property {string} text - The text content of the comment (required)
 * @property {mongoose.Types.ObjectId} commented_by - Reference to the User who made the comment (required)
 * @property {Date} comment_date_time - When the comment was posted (required)
 */
const CommentSchema = new mongoose.Schema({
  text: { type: String, required: true },
  commented_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  comment_date_time: { type: Date, required: true },
});

/**
 * Schema for documents in the Answers collection
 *
 * Defines the structure and behavior for answer documents in the application.
 * Contains answer content, voting data, and embedded comments.
 *
 * @property {String} text - The content of the answer (required)
 * @property {String} ans_by - Username of the person who posted the answer (required)
 * @property {Date} ans_date_time - When the answer was posted (required)
 * @property {Number} votes - The net vote count for the answer (required, default: 0)
 * @property {String[]} voted_by - Array of user emails who have voted for this answer (required, default: [])
 * @property {Object[]} comments - Array of embedded comment documents
 */
const AnswerSchema = new mongoose.Schema<IAnswerDocument, IAnswerModel>(
  {
    text: { type: String, required: true },
    ans_by: { type: String, required: true },
    ans_date_time: { type: Date, required: true },
    votes: { type: Number, required: true, default: 0 },
    voted_by: { type: [String], required: true, default: [] },
    comments: [CommentSchema],
  },
  { collection: "Answer" }
);

/**
 * Checks if a user has already voted for this answer
 *
 * @param {string} email - The user's email address to check
 * @returns {boolean} True if the user has already voted, false otherwise
 */
AnswerSchema.methods.hasUserVoted = function (email: string): Promise<boolean> {
  return this.voted_by.includes(email);
};

/**
 * Records an upvote from a user if they haven't already voted
 * Increments the vote count and adds the user to voted_by array
 *
 * @param {string} email - The email of the user upvoting
 * @returns {Promise<void>} Promise that resolves when the vote is recorded
 */
AnswerSchema.methods.vote = async function (email: string): Promise<void> {
  if (!this.voted_by.includes(email)) {
    this.votes += 1;
    this.voted_by.push(email);
    await this.save();
  }
};

/**
 * Removes a user's vote if they previously voted
 * Decrements the vote count and removes the user from voted_by array
 *
 * @param {string} email - The email of the user removing their vote
 * @returns {Promise<void>} Promise that resolves when the vote is removed
 */
AnswerSchema.methods.unvote = async function (email: string): Promise<void> {
  if (this.voted_by.includes(email)) {
    this.votes = Math.max(0, this.votes - 1);
    this.voted_by = this.voted_by.filter((u: string) => u !== email);
    await this.save();
  }
};

/**
 * Adds a new comment to the answer
 *
 * @param {Object} comment - The comment to add
 * @param {string} comment.text - The text content of the comment
 * @param {mongoose.Types.ObjectId} comment.commented_by - Reference to the commenter's user ID
 * @param {Date} comment.comment_date_time - When the comment was posted
 * @returns {Promise<void>} Promise that resolves when the comment is added
 */
AnswerSchema.methods.addComment = async function (comment: {
  text: string;
  commented_by: mongoose.Types.ObjectId;
  comment_date_time: Date;
}): Promise<void> {
  this.comments.push(comment);
  await this.save();
};

/**
 * Retrieves the most recent answers from a list of answer IDs
 *
 * @param {mongoose.Types.ObjectId[]} answers - Array of answer IDs to find
 * @returns {Promise<IAnswerDocument[]>} Promise resolving to array of answer documents sorted by date (newest first)
 */
AnswerSchema.statics.getMostRecent = async function (
  answers: mongoose.Types.ObjectId[]
): Promise<IAnswerDocument[]> {
  return await this.find({ _id: { $in: answers } })
    .sort({ ans_date_time: -1 })
    .exec();
};

/**
 * Finds the most recent date from a list of answer documents
 *
 * @param {Array<IAnswerDB | object>} answers - Array of answer documents or objects
 * @returns {Promise<Date | undefined>} Promise resolving to the most recent date or undefined if no answers
 */
AnswerSchema.statics.getLatestAnswerDate = async function (
  answers: Array<IAnswerDB | object>
): Promise<Date | undefined> {
  if (!answers.length) return undefined;

  // Type guard to check if the object is of type IAnswerDB
  const isIAnswerDB = (answer: object | IAnswerDB): answer is IAnswerDB =>
    (answer as IAnswerDB).ans_date_time instanceof Date;

  const dates = answers
    .filter(isIAnswerDB)
    .map((answer) => answer.ans_date_time)
    .sort((a, b) => b.getTime() - a.getTime());

  return dates[0];
};

/**
 * Creates a new answer and adds it to the specified question
 *
 * @param {string} qid - ID of the question to add the answer to
 * @param {IAnswer} answerData - Data for the new answer
 * @returns {Promise<IAnswer>} Promise resolving to the created answer
 * @throws {Error} If the question is not found
 */
AnswerSchema.statics.addAnswerToQuestion = async function (
  qid: string,
  answerData: IAnswer
): Promise<IAnswer> {
  const question = await Question.findById(qid).exec();
  if (!question) {
    throw new Error("Question not found");
  }

  const answer = new this({
    text: answerData.text,
    ans_by: answerData.ans_by,
    ans_date_time: new Date(answerData.ans_date_time),
    votes: 0,
    voted_by: [],
    comments: [],
  });

  await answer.save();
  await question.addAnswer(answer._id);
  await question.save();

  return { ...answerData, _id: answer._id.toString() };
};

export default AnswerSchema;
