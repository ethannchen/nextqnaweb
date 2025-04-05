import mongoose, { Schema } from "mongoose";
import {
  IQuestion,
  IQuestionDocument,
  IQuestionModel,
  ITag,
} from "../../types/types";
import Answer from "../answers";
import Tag from "../tags";

/**
 * The schema for a document in the Question collection.
 *
 * The schema is created using the constructor in mongoose.Schema class.
 * The schema is defined with two generic parameters: IQuestionDocument and IQuestionModel.
 * IQQuestionDocument is used to define the instance methods of the Question document.
 * IQuestionModel is used to define the static methods of the Question model.
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
 * An async method that increments the views of a question by 1
 * @returns the question object that has been saved
 */
QuestionSchema.methods.incrementViews =
  async function (): Promise<IQuestionDocument> {
    this.views += 1;
    return await this.save();
  };

/**
 * An async method that adds an answer to a question
 * @param answerId - the id of the answer
 * @returns the question object that has been saved
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
 * A boolean virtual property that indicates whether the question has answers
 * @returns a boolean indicating if the question has answers
 */
QuestionSchema.virtual("hasAnswers").get(function () {
  return this.answers.length > 0;
});

/**
 * A Date virtual property that represents the most recent answer on the question
 * @returns a Dare virtual property for the most recent answer
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
 * An async method that adds a new question to the collection
 * @param question - the data of the new question
 * @returns the saved question
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
 * An async method that returns all questions in newest order
 * @returns all questions in newest order
 */
QuestionSchema.statics.getNewestQuestions = async function (): Promise<
  IQuestion[]
> {
  const questions = await this.find().sort({ ask_date_time: -1 }).exec();
  return await Promise.all(questions.map((q) => q.convertToIQuestion()));
};

/**
 * An async method that returns all questions that have no answers
 * @returns all questions that have no answers
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
 * An async method that returns all questions in active order
 * @returns all questions in active order
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
 * An async method that finds a question by id and increments its views by 1
 * @param qid - the id of the question
 * @returns the question of that id or null if that id does not exist
 */
QuestionSchema.statics.findByIdAndIncrementViews = async function (
  qid: string
): Promise<IQuestion | null> {
  const question = await this.findById(qid).exec();
  if (!question) {
    return null;
  } else {
    await question.incrementViews();
    return question.convertToIQuestion();
  }
};

/**
 * convert the question document to IQuestion type
 * @param question - the question document
 * @returns the converted question of the IQuestion type
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

    // retrieve the answers and sort by answer time
    const answers = answerObjects
      .filter((a): a is NonNullable<typeof a> => a !== null)
      .sort((a, b) => b.ans_date_time.getTime() - a.ans_date_time.getTime())
      .map((a) => ({
        _id: a._id.toString(),
        text: a.text,
        ans_by: a.ans_by,
        ans_date_time: a.ans_date_time.toISOString(),
        votes: a.votes,
        voted_by: a.voted_by,
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
