import mongoose, { Schema } from "mongoose";
import {
  IComment,
  IQuestion,
  IQuestionDocument,
  IQuestionModel,
  ITag,
} from "../../types/types";
import Answer from "../answers";
import Tag from "../tags";
import User from "../users";

/**
 * Schema for documents in the Questions collection
 *
 * Defines the structure and behavior for question documents in the application.
 * Contains core question data, references to related entities like answers and tags,
 * and methods for common operations.
 *
 * @property {String} title - The question title (required)
 * @property {String} text - The detailed content of the question (required)
 * @property {mongoose.Types.ObjectId[]} tags - Array of references to Tag documents (required)
 * @property {mongoose.Types.ObjectId[]} answers - Array of references to Answer documents (required)
 * @property {String} asked_by - Username of the person who asked the question (required)
 * @property {Date} ask_date_time - When the question was posted (required)
 * @property {Number} views - Count of how many times the question has been viewed (required, default: 0)
 */
const QuestionSchema = new mongoose.Schema<IQuestionDocument, IQuestionModel>(
  {
    title: { type: String, required: true },
    text: { type: String, required: true },
    asked_by: { type: String, required: true },
    ask_date_time: { type: Date, required: true },
    views: { type: Number, required: true, default: 0 },
    answers: [{ type: Schema.Types.ObjectId, ref: "Answer", required: true }],
    tags: [{ type: Schema.Types.ObjectId, ref: "Tag", required: true }],
  },
  { collection: "Question" }
);

/**
 * Increments the views count of a question by 1
 *
 * @returns {Promise<IQuestionDocument>} Promise resolving to the updated question document
 */
QuestionSchema.methods.incrementViews =
  async function (): Promise<IQuestionDocument> {
    this.views += 1;
    return await this.save();
  };

/**
 * Adds an answer reference to the question's answers array if not already present
 *
 * @param {mongoose.Types.ObjectId} answerId - The ID of the answer to add
 * @returns {Promise<IQuestionDocument>} Promise resolving to the updated question document
 */
QuestionSchema.methods.addAnswer = async function (
  answerId: mongoose.Types.ObjectId
): Promise<IQuestionDocument> {
  if (!this.answers.includes(answerId)) {
    this.answers.push(answerId);
    return await this.save();
  }
  return this.save();
};

/**
 * Virtual property that indicates whether the question has any answers
 *
 * @returns {boolean} True if the question has at least one answer, false otherwise
 */
QuestionSchema.virtual("hasAnswers").get(function () {
  return this.answers.length > 0;
});

/**
 * Virtual property that represents the timestamp of the most recent activity on this question
 * Either the ask_date_time if no answers, or the most recent answer's timestamp
 *
 * @returns {Promise<Date>} Promise resolving to the date of the most recent activity
 */
QuestionSchema.virtual("mostRecentActivity").get(async function () {
  if (this.answers.length === 0) {
    return this.ask_date_time;
  }
  const populatedAnswers = await this.populate("answers");
  const lastAnswerDate = await Answer.getLatestAnswerDate(
    populatedAnswers.answers
  );
  return lastAnswerDate || this.ask_date_time;
});

/**
 * Creates a new question in the database
 *
 * @param {IQuestion} question - The question data to add
 * @returns {Promise<IQuestion>} Promise resolving to the created question
 */
QuestionSchema.statics.addQuestion = async function (
  question: IQuestion
): Promise<IQuestion> {
  const tagIds = question.tags.map((t) => t._id);
  const questionToAdd = new this({
    ...question,
    tags: tagIds,
    ask_date_time: new Date(question.ask_date_time.toString()),
  });
  await questionToAdd.save();
  const tagsToReturn: ITag[] = question.tags.map((t) => ({
    _id: t._id?.toString(),
    name: t.name,
    qcnt: t.qcnt,
  }));
  return { ...question, _id: questionToAdd._id.toString(), tags: tagsToReturn };
};

/**
 * Retrieves all questions sorted by creation date (newest first)
 *
 * @returns {Promise<IQuestion[]>} Promise resolving to array of questions in newest-first order
 */
QuestionSchema.statics.getNewestQuestions = async function (): Promise<
  IQuestion[]
> {
  const questions = await this.find().sort({ ask_date_time: -1 }).exec();
  return await Promise.all(questions.map((q) => q.convertToIQuestion()));
};

/**
 * Retrieves all questions that have no answers
 *
 * @returns {Promise<IQuestion[]>} Promise resolving to array of unanswered questions
 */
QuestionSchema.statics.getUnansweredQuestions = async function (): Promise<
  IQuestion[]
> {
  const questions = await this.find({ answers: { $size: 0 } })
    .sort({ ask_date_time: -1 })
    .exec();

  return await Promise.all(questions.map((q) => q.convertToIQuestion()));
};

/**
 * Retrieves all questions sorted by most recent activity
 * Activity is defined as either a new answer or the original question posting
 *
 * @returns {Promise<IQuestion[]>} Promise resolving to array of questions sorted by activity
 */
QuestionSchema.statics.getActiveQuestions = async function (): Promise<
  IQuestion[]
> {
  const questions = await this.find().exec();

  const convertedQuestions = await Promise.all(
    questions.map(async (q) => await q.convertToIQuestion())
  );

  convertedQuestions.sort(
    (a, b) => b.mostRecentActivity.getTime() - a.mostRecentActivity.getTime()
  );

  return convertedQuestions;
};

/**
 * Finds a question by ID, increments its view count, and returns the populated question
 *
 * @param {string} qid - The question ID to find
 * @returns {Promise<IQuestion | null>} Promise resolving to the found question or null
 */
QuestionSchema.statics.findByIdAndIncrementViews = async function (
  qid: string
): Promise<IQuestion | null> {
  const question = await this.findById(qid)
    .populate({
      path: "answers",
      populate: {
        path: "comments.commented_by",
        select: "username",
      },
    })
    .exec();

  if (!question) {
    return null;
  } else {
    await question.incrementViews();
    return question.convertToIQuestion();
  }
};

/**
 * Converts a Question document to the IQuestion interface format
 * Populates tags and answers with their full data and prepares the question for client use
 *
 * @returns {Promise<IQuestion>} Promise resolving to the converted question
 */
QuestionSchema.methods.convertToIQuestion =
  async function (): Promise<IQuestion> {
    const question = this.toObject({ virtuals: true });
    question.mostRecentActivity = await question.mostRecentActivity;

    const tagObjects = await Promise.all(
      this.tags.map(
        async (t: mongoose.Types.ObjectId) => await Tag.findById(t).exec()
      )
    );
    const tags: ITag[] = tagObjects.map((t) => ({
      _id: t._id.toString(),
      name: t.name,
    }));

    const answerObjects = await Promise.all(
      this.answers.map(
        async (a: mongoose.Types.ObjectId) => await Answer.findById(a).exec()
      )
    );

    const validAnswers = answerObjects.filter(
      (a): a is NonNullable<typeof a> => a !== null
    );

    // collect all unique commenter ObjectIds
    const commenterIds = new Set<string>();
    for (const answer of validAnswers) {
      for (const comment of answer.comments || []) {
        commenterIds.add(comment.commented_by.toString());
      }
    }

    // fetch all users
    const userDocs = await User.find({ _id: { $in: Array.from(commenterIds) } })
      .select("_id username")
      .exec();
    const userMap = new Map<string, string>();
    for (const user of userDocs) {
      userMap.set(user._id.toString(), user.username);
    }

    // retrieve the answers and sort by votes then by answer time
    const answers = answerObjects
      .filter((a): a is NonNullable<typeof a> => a !== null)
      .sort((a, b) => {
        if (b.votes !== a.votes) {
          return b.votes - a.votes;
        }
        return b.ans_date_time.getTime() - a.ans_date_time.getTime();
      })
      .map((a) => ({
        _id: a._id.toString(),
        text: a.text,
        ans_by: a.ans_by,
        ans_date_time: a.ans_date_time.toISOString(),
        votes: a.votes,
        voted_by: a.voted_by,
        comments: a.comments?.map((c: IComment) => ({
          _id: c._id?.toString(),
          text: c.text,
          commented_by: {
            _id: c.commented_by.toString(),
            username: userMap.get(c.commented_by.toString()) ?? "(unknown)",
          },
          comment_date_time: c.comment_date_time.toISOString(),
        })),
      }));

    const convertedQuestion = {
      _id: this._id.toString(),
      title: this.title,
      text: this.text,
      tags,
      answers,
      asked_by: this.asked_by,
      ask_date_time: this.ask_date_time.toISOString(),
      views: this.views,
      mostRecentActivity: question.mostRecentActivity,
    };

    return convertedQuestion;
  };

export default QuestionSchema;
