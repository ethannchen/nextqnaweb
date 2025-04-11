/**
 * @file This file contains the types of data model used in the application.
 */

/**
 * The type of an answer object.
 * @property {string} text - The answer text.
 * @property {string} ans_by - The user who answered the question.
 * @property {Date} ans_date_time - The date and time when the answer was posted.
 * @property {number} votes - The count of upvotes
 * @property {string[]} voted_by - The emails of the answer's upvoters
 */
interface AnswerType {
  text: string;
  ans_by: string;
  ans_date_time: Date;
  votes: number;
  voted_by: string[];
  _id?: string;
}

/**
 * The type of a question object.
 * @property {string} title - The title of the question.
 * @property {string} text - The text of the question.
 * @property {Tag[]} tags - An array of tag objects.
 * @property {string} asked_by - The user who asked the question.
 * @property {Date} ask_date_time - The date and time when the question was posted.
 * @property {number} views - The number of views of the question.
 */
interface QuestionType {
  title: string;
  text: string;
  tags: Tag[];
  asked_by: string;
  ask_date_time: Date;
}

/**
 * The type of a question object received from the server.
 * @property {string} _id - The unique identifier of the question.
 * @property {AnswerType[]} answers - An array of answer objects.
 * @property {number} views - The number of views of the question.
 * @property {string} title - The title of the question.
 * @property {Tag[]} tags - An array of tag objects.
 * @property {string} asked_by - The user who asked the question.
 * @property {string} ask_date_time - The date and time when the question was posted.
 * @property {string} text - The text of the question.
 */
interface QuestionResponseType {
  _id: string;
  answers: AnswerType[];
  views: number;
  title: string;
  tags: { name: string }[];
  asked_by: string;
  ask_date_time: string;
  text: string;
}

/**
 * The type of a question object.
 * @property {AnswerType[]} answers - An array of answer objects.
 * @property {number} views - The number of views of the question.
 * @property {string} title - The title of the question.
 * @property {string} text - The text of the question.
 * @property {string} asked_by - The user who asked the question.
 * @property {string} ask_date_time - The date and time when the question was posted.
 */
interface Question {
  answers: {
    text: string;
    ans_by: string;
    ans_date_time: string;
  }[];
  title: string;
  views: number;
  text: string;
  asked_by: string;
  ask_date_time: string;
}

/**
 * The type of a tag object.
 * @property {string} name - The name of the tag.
 */
interface Tag {
  name: string;
}

/**
 * The type of a tag object received from the server.
 * @property {string} name - The name of the tag.
 * @property {string} _id - The unique identifier of the tag.
 */
interface TagResponseType {
  name: string;
  _id: string;
  qcnt: number;
}

export type {
  AnswerType,
  QuestionType,
  Question,
  Tag,
  QuestionResponseType,
  TagResponseType,
};
