import mongoose from "mongoose";
import { IAnswerDB } from "../../scripts/script_types";
import { IAnswer, IAnswerDocument, IAnswerModel } from "../../types/types";
import Question from "../questions";

/**
 * @typedef {Object} Comment
 * @property {string} text - The text content of the comment
 * @property {string} commented_by - The username or email of the user who made the comment
 * @property {Date} comment_date_time - The timestamp when the comment was created
 */
const CommentSchema = new mongoose.Schema({
  text: { type: String, required: true },
  commented_by: { type: String, required: true },
  comment_date_time: { type: Date, required: true },
});

/**
 * The schema for a document in the Answer collection.
 *
 * The schema is created using the constructor in mongoose.Schema class.
 * The schema is defined with two generic parameters: IAnswerDocument and IAnswerModel.
 * IAnswerDocument is used to define the instance methods of the Answer document.
 * IAnswerModel is used to define the static methods of the Answer model.
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
 * Check if a user has voted for this answer
 * @param email - the username or user id
 * @returns - if the user has voted for the answer
 */
AnswerSchema.methods.hasUserVoted = function (email: string): boolean {
  return this.voted_by.includes(email);
};

/**
 * Upvote the answer by a user
 * @param email - the username or user id
 */
AnswerSchema.methods.vote = async function (email: string): Promise<void> {
  if (!this.voted_by.includes(email)) {
    this.votes += 1;
    this.voted_by.push(email);
    await this.save();
  }
};

/**
 * Remove vote (unvote) by a user
 * @param email - the username or user id
 */
AnswerSchema.methods.unvote = async function (email: string): Promise<void> {
  if (this.voted_by.includes(email)) {
    this.votes = Math.max(0, this.votes - 1);
    this.voted_by = this.voted_by.filter((u: string) => u !== email);
    await this.save();
  }
};

/**
 * Add comment to an answer
 * @param comment - the comment to be added
 */
AnswerSchema.methods.addComment = async function (comment: {
  text: string;
  commented_by: string;
  comment_date_time: string;
}): Promise<void> {
  this.comments.push(comment);
  await this.save();
};

/**
 * An async method that returns an array with the most recent answer document for a list of answer ids
 * @param answers - the list of answer ids
 * @returns the most recent answers with those ids
 */
AnswerSchema.statics.getMostRecent = async function (
  answers: mongoose.Types.ObjectId[]
): Promise<IAnswerDocument[]> {
  return await this.find({ _id: { $in: answers } })
    .sort({ ans_date_time: -1 })
    .exec();
};

/**
 * An async method that returns the latest answer date for a list of answer documents
 * @param answers - the list of answer documents
 * @returns the latest answer date
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
 * An async method that adds an answer to a specific question represented by question id
 * @param qid - question id
 * @param answerData - data of the answer
 * @returns the saved answer data
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
  });

  await answer.save();
  await question.addAnswer(answer._id);
  await question.save();

  return { ...answerData, _id: answer._id.toString() };
};

export default AnswerSchema;
