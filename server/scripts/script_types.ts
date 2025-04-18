import mongoose from "mongoose";

/**
 * User document interface
 * Defines the shape of user documents in the Users collection
 *
 * @property _id - Optional MongoDB ObjectId for the user document
 * @property username - Username for the user account
 * @property email - Email address for the user account
 * @property password - Hashed password for the user account
 * @property role - Optional user role (default: 'user')
 * @property bio - Optional user biography
 * @property website - Optional user website URL
 * @property createdAt - Optional creation date for the user account
 */
export interface IUser {
  _id?: mongoose.Types.ObjectId;
  username: string;
  email: string;
  password: string;
  role?: string;
  bio?: string;
  website?: string;
  createdAt?: Date;
}

/**
 * Comment interface
 * Defines the shape of comment objects stored within answer documents
 *
 * @property _id - Optional MongoDB ObjectId for the comment
 * @property text - Text content of the comment
 * @property commented_by - MongoDB ObjectId reference to the user who made the comment
 * @property comment_date_time - Date and time when the comment was posted
 */
export interface IComment {
  _id?: mongoose.Types.ObjectId;
  text: string;
  commented_by: mongoose.Types.ObjectId;
  comment_date_time: Date;
}

/**
 * Answer document interface
 * Defines the shape of answer documents in the Answer collection
 *
 * @property _id - Optional MongoDB ObjectId for the answer document
 * @property text - Text content of the answer
 * @property ans_by - Username of the user who provided the answer
 * @property ans_date_time - Date and time when the answer was posted
 * @property votes - Number of votes for the answer
 * @property voted_by - Array of user emails who voted on the answer
 * @property comments - Array of comments on the answer
 */
export interface IAnswerDB {
  _id?: mongoose.Types.ObjectId;
  text: string;
  ans_by: string;
  ans_date_time: Date;
  votes: number;
  voted_by: string[];
  comments: IComment[];
}

/**
 * Question document interface
 * Defines the shape of question documents in the Question collection
 *
 * @property _id - Optional MongoDB ObjectId for the question document
 * @property title - Title of the question
 * @property text - Text content of the question
 * @property tags - Array of tag objects associated with the question
 * @property answers - Array of answer objects (or their IDs) associated with the question
 * @property asked_by - Optional username of the user who asked the question
 * @property ask_date_time - Date and time when the question was posted
 * @property views - Number of views for the question
 */
export interface IQuestionDB {
  _id?: mongoose.Types.ObjectId;
  title: string;
  text: string;
  tags: ITagDB[];
  answers: (IAnswerDB | mongoose.Types.ObjectId)[];
  asked_by?: string;
  ask_date_time: Date;
  views: number;
}

/**
 * Tag document interface
 * Defines the shape of tag documents in the Tags collection
 *
 * @property _id - Optional MongoDB ObjectId for the tag document
 * @property name - Name of the tag
 */
export interface ITagDB {
  _id?: mongoose.Types.ObjectId;
  name: string;
}
