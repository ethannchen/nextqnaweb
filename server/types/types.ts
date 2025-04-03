import mongoose from "mongoose";
import { IAnswerDB, IQuestionDB, ITagDB } from "../scripts/script_types";

/**
 * A type representing a question object
 * Use this type to define the shape of a question returned from Questions collection
 * @property {string} _id - The unique identifier of the question
 * @property {string} title - The title of the question
 * @property {string} text - The body of the question
 * @property {ITag[]} tags - The tags associated with the question
 * @property {IAnswer[]} answers - The answers to the question
 * @property {string} asked_by - The user who asked the question
 * @property {string} ask_date_time - The date and time the question was asked
 * @property {Number} views - The number of views the question has
 * @property {Date} mostRecentActivity- the date when the most recent answer is posted or ask date if no answer
 */
export interface IQuestion {
  _id?: string;
  title: string;
  text: string;
  tags: ITag[];
  answers: (IAnswer | mongoose.Types.ObjectId)[];
  asked_by?: string;
  ask_date_time: string;
  views: number;
  mostRecentActivity: Date;
}

/**
 * A type representing an answer object
 * Use this type to define the shape of an answer returned from Answers collection
 * @property {String} _id - The unique identifier of the answer
 * @property {String} text - The body of the answer
 * @property {String} ans_by - The user who answered the question
 * @property {String} ans_date_time - The date and time the answer was posted
 */
export interface IAnswer {
  _id?: string;
  text: string;
  ans_by: string;
  ans_date_time: string;
}

/**
 * A type representing a tag object
 * Use this type to define the shape of a tag returned from Tags collection
 * @property {String} _id - The unique identifier of the tag
 * @property {String} name - The name of the tag
 * @property {number} qcnt - the number of questions with this tag
 */
export interface ITag {
  _id?: string;
  name: string;
  qcnt?: number;
}

/**
 * A type representing a tag document schema in the tags collection
 * except the _id field, which is explicitly defined to have the type
 * mongoose.Types.ObjectId
 */
export interface ITagDocument
  extends Omit<mongoose.Document, "_id">,
    Omit<ITagDB, "_id"> {
  _id: mongoose.Types.ObjectId;
}

/**
 * A type representing a question document schema in the questions collection
 * except the _id field, which is explicitly defined to have the type
 * mongoose.Types.ObjectId and the answers field,
 * which is explicitly defined to have the type mongoose.Types.Array
 * where the elements are either mongoose.Types.ObjectId or IAnswer objects
 *
 * The IQuestionDocument interface also defines instance methods for a document in the questions collection.
 *
 * Instance methods work on the document level.
 *
 * @property incrementViews - An async method that increments the views of a question by 1
 * @property addAnswer - An async method that adds an answer to a question
 * @property hasAnswers - A boolean virtual property that indicates whether the question has answers
 * @property mostRecentActivity - A Date virtual property that represents the most recent answer on the question
 * @property convertToIQuestion - convert the question document to IQuestion type
 */
export interface IQuestionDocument
  extends Omit<mongoose.Document, "_id">,
    Omit<IQuestionDB, "_id" | "answers"> {
  _id: mongoose.Types.ObjectId;
  answers: mongoose.Types.Array<
    mongoose.Types.ObjectId | IQuestionDB["answers"][0]
  >;
  incrementViews(): Promise<IQuestionDocument>;
  addAnswer(answerId: mongoose.Types.ObjectId): Promise<IQuestionDocument>;
  hasAnswers: boolean;
  mostRecentActivity: Date;
  convertToIQuestion(): Promise<IQuestion>;
}

/**
 * A type representing the model for the questions collection.
 * The interface also defines static methods for the model.
 * Static methods work on the model or collection level.
 *
 * @property addQuestion - An async method that adds a new question to the collection
 * @property getNewestQuestions - An async method that returns all questions in newest order
 * @property getUnansweredQuestions - An async method that returns all questions that have no answers
 * @property getActiveQuestions - An async method that returns all questions in active order
 * @property findByIdAndIncrementViews - An async method that finds a question by id and increments its views by 1
 */
export interface IQuestionModel extends mongoose.Model<IQuestionDocument> {
  addQuestion(question: IQuestion): Promise<IQuestion>;
  getNewestQuestions(): Promise<IQuestion[]>;
  getUnansweredQuestions(): Promise<IQuestion[]>;
  getActiveQuestions(): Promise<IQuestion[]>;
  findByIdAndIncrementViews(qid: string): Promise<IQuestion | null>;
}

/**
 * A type representing the model for the tags collection
 * The interface also defines static methods for the model
 *
 * @property findOrCreateMany - An async method that finds existing tags by name or creates new tags if they do not exist
 * @property validateTags - An async method that validates an array of tag ids is the same as the number of tag documents in the collection
 * @property getTagsWithQuestionNumber - An async method that get all tags with corresponding question count
 * @property getTags - An async method that get tags with ID using a tag array that contains tag names
 */
export interface ITagModel extends mongoose.Model<ITag> {
  findOrCreateMany(tagNames: string[]): Promise<ITag[]>;
  validateTags(tagIds: mongoose.Types.ObjectId[]): Promise<boolean>;
  getTagsWithQuestionNumber(): Promise<ITag[]>;
  getTags(tags: ITag[]): Promise<ITag[]>;
}

/**
 * A type representing a model for the answers collection
 * The interface also defines static methods for the model
 *
 * @property getMostRecent - An async method that returns an array with the most recent answer document for a list of answer ids
 * @property getLatestAnswerDate - An async method that returns the latest answer date for a list of answer documents
 * @property addAnswerToQuestion - An async method that adds an answer to a specific question represented by question id
 */
export interface IAnswerModel extends mongoose.Model<IAnswerDocument> {
  getMostRecent(answers: mongoose.Types.ObjectId[]): Promise<IAnswerDocument[]>;
  getLatestAnswerDate(
    answers: Array<IAnswerDB | object>
  ): Promise<Date | undefined>;
  addAnswerToQuestion(qid: string, answerData: IAnswer): Promise<IAnswer>;
}

/**
 * A type representing an answer document schema in the answers collection
 * except the _id field, which is explicitly defined to have the type
 */
export interface IAnswerDocument
  extends Omit<mongoose.Document, "_id">,
    Omit<IAnswerDB, "_id"> {
  _id: mongoose.Types.ObjectId;
}

/**
 * A type representing a user object
 * Use this type to define the shape of a user returned from the Users collection
 * @property {string} _id - The unique identifier of the user
 * @property {string} username - The username of the user
 * @property {string} email - The email of the user
 * @property {string} password - The hashed password of the user
 * @property {Date} createdAt - The date when the user account was created
 */
export interface IUser {
  _id?: string;
  username: string;
  email: string;
  password: string;
  createdAt?: Date;
}

/**
 * A type representing a user document schema in the users collection
 * except the _id field, which is explicitly defined to have the type mongoose.Types.ObjectId
 */
export interface IUserDocument extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  username: string;
  email: string;
  password: string;
  createdAt: Date;

  // Instance Methods
  comparePassword(candidatePassword: string): Promise<boolean>;
}

/**
 * A type representing the model for the users collection
 * The interface also defines static methods for the model
 *
 * @property findByEmail - An async method that finds a user by email
 * @property findByUsername - An async method that finds a user by username
 * @property createUser - An async method that creates a new user
 */
export interface IUserModel extends mongoose.Model<IUserDocument> {
  findByEmail(email: string): Promise<IUserDocument | null>;
  findByUsername(username: string): Promise<IUserDocument | null>;
  createUser(userData: IUser): Promise<IUserDocument>;
}
