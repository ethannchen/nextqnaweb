/**
 * This module contains interface and type definitions for component props used throughout the application.
 * These definitions ensure consistent type-checking for props passed between components.
 *
 * @module componentProps
 */
import { ReactNode } from "react";
import { AnswerType, Tag, CommentType } from "./entityTypes";
import {
  ClickTagFunctionType,
  IdFunctionType,
  MessageFunctionType,
  OrderFunctionType,
  PageSetterFunctionType,
  QuestionIdFunctionType,
  QuestionsPageQueryFuntionType,
  StringFunctionType,
  VoidFunctionType,
} from "./functionTypes";

/**
 * Props interface for the Header component.
 *
 * @interface HeaderProps
 * @property {string} search - The current search query string
 * @property {QuestionsPageQueryFuntionType} setQuestionPage - Function to navigate to the questions page with specified query and title
 */
export interface HeaderProps {
  search: string;
  setQuestionPage: QuestionsPageQueryFuntionType;
}

/**
 * Props interface for the AnswerPage component.
 *
 * @interface AnswerPageProps
 * @property {string} qid - The ID of the question being answered
 * @property {VoidFunctionType} handleNewQuestion - Function to navigate to the new question form
 * @property {VoidFunctionType} handleNewAnswer - Function to navigate to the new answer form
 */
export interface AnswerPageProps {
  qid: string;
  handleNewQuestion: VoidFunctionType;
  handleNewAnswer: VoidFunctionType;
}

/**
 * Props interface for the AnswerHeader component.
 *
 * @interface AnswerHeaderProps
 * @property {number} ansCount - The number of answers for the question
 * @property {string} title - The title of the question
 * @property {VoidFunctionType} handleNewQuestion - Function to navigate to the new question form
 */
export interface AnswerHeaderProps {
  ansCount: number;
  title: string;
  handleNewQuestion: VoidFunctionType;
}

/**
 * Props interface for the QuestionBody component.
 *
 * @interface QuestionBodyProps
 * @property {number} views - The number of views for the question
 * @property {string} text - The question text/content
 * @property {string} askby - The username of the person who asked the question
 * @property {string} meta - The metadata (typically formatted date) of the question
 */
export interface QuestionBodyProps {
  views: number;
  text: string;
  askby: string;
  meta: string;
}

/**
 * Props interface for the Answer component.
 *
 * @interface AnswerProps
 * @property {string} text - The answer text/content
 * @property {string} ansBy - The username of the person who provided the answer
 * @property {string} meta - The metadata (typically formatted date) of the answer
 * @property {number} votes - The number of votes for the answer
 * @property {string[]} voted_by - Array of usernames who have voted for this answer
 * @property {Function} handleVote - Function to handle voting on the answer
 * @property {string} [aid] - Optional ID of the answer
 * @property {CommentType[]} comments - Array of comments on the answer
 */
export interface AnswerProps {
  text: string;
  ansBy: string;
  meta: string;
  votes: number;
  voted_by: string[];
  handleVote: (aid: string) => Promise<AnswerType | undefined>;
  aid?: string;
  comments: CommentType[];
}

/**
 * Props interface for the Form component.
 *
 * @interface FormProps
 * @property {ReactNode} children - The child elements to render within the form
 */
export interface FormProps {
  children: ReactNode;
}

/**
 * Props interface for the Input component.
 *
 * @interface InputProps
 * @property {string} title - The label text for the input
 * @property {string} [hint] - Optional hint text to display
 * @property {string} id - The ID attribute for the input element
 * @property {boolean} [mandatory] - Whether the input is required
 * @property {string} val - The current value of the input
 * @property {StringFunctionType} setState - Function to update the input value
 * @property {string} [err] - Optional error message to display
 */
export interface InputProps {
  title: string;
  hint?: string;
  id: string;
  mandatory?: boolean;
  val: string;
  setState: StringFunctionType;
  err?: string;
}

/**
 * Props interface for the Textarea component.
 *
 * @interface TextareaProps
 * @property {string} title - The label text for the textarea
 * @property {boolean} [mandatory] - Whether the textarea is required
 * @property {string} [hint] - Optional hint text to display
 * @property {string} id - The ID attribute for the textarea element
 * @property {string} val - The current value of the textarea
 * @property {StringFunctionType} setState - Function to update the textarea value
 * @property {string} [err] - Optional error message to display
 */
export interface TextareaProps {
  title: string;
  mandatory?: boolean;
  hint?: string;
  id: string;
  val: string;
  setState: StringFunctionType;
  err?: string;
}

/**
 * Props interface for the NewAnswer component.
 *
 * @interface NewAnswerProps
 * @property {string} qid - The ID of the question being answered
 * @property {QuestionIdFunctionType} handleAnswer - Function to handle submitting the answer
 */
export interface NewAnswerProps {
  qid: string;
  handleAnswer: QuestionIdFunctionType;
}

/**
 * Props interface for the NewQuestion component.
 *
 * @interface NewQuestionProps
 * @property {VoidFunctionType} handleQuestions - Function to navigate back to the questions list after submission
 */
export interface NewQuestionProps {
  handleQuestions: VoidFunctionType;
}

/**
 * Props interface for the OrderButton component.
 *
 * @interface OrderButtonProps
 * @property {string} message - The button text/label
 * @property {MessageFunctionType} setQuestionOrder - Function to set the question ordering
 */
export interface OrderButtonProps {
  message: string;
  setQuestionOrder: MessageFunctionType;
}

/**
 * Props interface for the QuestionHeader component.
 *
 * @interface QuestionHeaderProps
 * @property {string} title_text - The header title text
 * @property {number} qcnt - The count of questions displayed
 * @property {MessageFunctionType} setQuestionOrder - Function to set the question ordering
 * @property {VoidFunctionType} handleNewQuestion - Function to navigate to the new question form
 */
export interface QuestionHeaderProps {
  title_text: string;
  qcnt: number;
  setQuestionOrder: MessageFunctionType;
  handleNewQuestion: VoidFunctionType;
}

/**
 * Props interface for the Question component.
 *
 * @interface QuestionProps
 * @property {Object} q - The question data object
 * @property {string} q._id - Unique identifier for the question
 * @property {AnswerType[]} q.answers - Array of answers to the question
 * @property {number} q.views - Number of views for the question
 * @property {string} q.title - The question title
 * @property {Tag[]} q.tags - Array of tags associated with the question
 * @property {string} q.asked_by - Username of the person who asked the question
 * @property {string} q.ask_date_time - Timestamp when the question was asked
 * @property {ClickTagFunctionType} clickTag - Function to handle clicking on a tag
 * @property {IdFunctionType} handleAnswer - Function to navigate to the answer page for this question
 */
export interface QuestionProps {
  q: {
    _id: string;
    answers: AnswerType[];
    views: number;
    title: string;
    tags: Tag[];
    asked_by: string;
    ask_date_time: string;
  };
  clickTag: ClickTagFunctionType;
  handleAnswer: IdFunctionType;
}

/**
 * Props interface for the QuestionPage component.
 *
 * @interface QuestionPageProps
 * @property {string} [title_text] - Optional title text for the page
 * @property {string} order - The current ordering of questions
 * @property {string} search - The current search query
 * @property {OrderFunctionType} setQuestionOrder - Function to set the question ordering
 * @property {ClickTagFunctionType} clickTag - Function to handle clicking on a tag
 * @property {IdFunctionType} handleAnswer - Function to navigate to the answer page for a question
 * @property {VoidFunctionType} handleNewQuestion - Function to navigate to the new question form
 */
export interface QuestionPageProps {
  title_text?: string;
  order: string;
  search: string;
  setQuestionOrder: OrderFunctionType;
  clickTag: ClickTagFunctionType;
  handleAnswer: IdFunctionType;
  handleNewQuestion: VoidFunctionType;
}

/**
 * A type alias representing a function that takes no parameters and returns void.
 * Used for simple action handlers that don't require parameters.
 *
 * @typedef {Function} NoParamHandler
 * @returns {void}
 */
export type NoParamHandler = () => void;

/**
 * A type alias representing a function that takes a string parameter and returns void.
 * Used for handlers that need to process a string value.
 *
 * @typedef {Function} StringHandler
 * @param {string} param - The string parameter
 * @returns {void}
 */
export type StringHandler = (param: string) => void;

/**
 * Interface for parameters needed to create a page instance in the application.
 * Contains all necessary state and handler functions to render any page.
 *
 * @interface PageClassParams
 * @property {string} search - The current search query
 * @property {string} title - The page title
 * @property {PageSetterFunctionType} setQuestionPage - Function to set the question page
 * @property {string} questionOrder - The current question ordering
 * @property {StringHandler} setQuestionOrder - Function to set the question ordering
 * @property {string} qid - The current question ID
 * @property {NoParamHandler} handleQuestions - Function to navigate to the questions list
 * @property {NoParamHandler} handleTags - Function to navigate to the tags page
 * @property {StringHandler} handleAnswer - Function to handle viewing answers for a question
 * @property {StringHandler} clickTag - Function to handle clicking on a tag
 * @property {NoParamHandler} handleNewQuestion - Function to navigate to the new question form
 * @property {NoParamHandler} handleNewAnswer - Function to navigate to the new answer form
 * @property {NoParamHandler} handleLogin - Function to navigate to the login page
 * @property {NoParamHandler} handleSignup - Function to navigate to the signup page
 * @property {NoParamHandler} handleLogout - Function to handle user logout
 * @property {NoParamHandler} handleProfile - Function to navigate to the user profile
 * @property {NoParamHandler} handleEditProfile - Function to navigate to the profile edit page
 * @property {NoParamHandler} handleChangePassword - Function to navigate to the change password page
 * @property {NoParamHandler} handleDeleteAccount - Function to navigate to the delete account page
 */
export interface PageClassParams {
  search: string;
  title: string;
  setQuestionPage: PageSetterFunctionType;
  questionOrder: string;
  setQuestionOrder: StringHandler;
  qid: string;
  handleQuestions: NoParamHandler;
  handleTags: NoParamHandler;
  handleAnswer: StringHandler;
  clickTag: StringHandler;
  handleNewQuestion: NoParamHandler;
  handleNewAnswer: NoParamHandler;
  handleLogin: NoParamHandler;
  handleSignup: NoParamHandler;
  handleLogout: NoParamHandler;
  handleProfile: NoParamHandler;
  handleEditProfile: NoParamHandler;
  handleChangePassword: NoParamHandler;
  handleDeleteAccount: NoParamHandler;
}

/**
 * Props interface for the LoginView component.
 *
 * @interface LoginViewProps
 * @property {VoidFunctionType} handleSignup - Function to navigate to the signup page
 * @property {VoidFunctionType} handleQuestions - Function to navigate to the questions list
 */
export interface LoginViewProps {
  handleSignup: VoidFunctionType;
  handleQuestions: VoidFunctionType;
}

/**
 * Props interface for the SignupView component.
 *
 * @interface SignupViewProps
 * @property {VoidFunctionType} handleLogin - Function to navigate to the login page
 * @property {VoidFunctionType} handleQuestions - Function to navigate to the questions list
 */
export interface SignupViewProps {
  handleLogin: VoidFunctionType;
  handleQuestions: VoidFunctionType;
}

/**
 * Props interface for the ProfileView component.
 *
 * @interface ProfileViewProps
 * @property {VoidFunctionType} handleEditProfile - Function to navigate to the profile edit page
 * @property {VoidFunctionType} handleChangePassword - Function to navigate to the change password page
 * @property {VoidFunctionType} handleDeleteAccount - Function to navigate to the delete account page
 */
export interface ProfileViewProps {
  handleEditProfile: VoidFunctionType;
  handleChangePassword: VoidFunctionType;
  handleDeleteAccount: VoidFunctionType;
}

/**
 * Props interface for the ProfileEditView component.
 *
 * @interface ProfileEditViewProps
 * @property {VoidFunctionType} handleProfile - Function to navigate back to the profile page
 */
export interface ProfileEditViewProps {
  handleProfile: VoidFunctionType;
}

/**
 * Props interface for the ChangePasswordView component.
 *
 * @interface ChangePasswordViewProps
 * @property {VoidFunctionType} handleProfile - Function to navigate back to the profile page
 */
export interface ChangePasswordViewProps {
  handleProfile: VoidFunctionType;
}

/**
 * Props interface for the DeleteAccountView component.
 *
 * @interface DeleteAccountViewProps
 * @property {VoidFunctionType} handleProfile - Function to navigate back to the profile page
 * @property {VoidFunctionType} handleQuestions - Function to navigate to the questions list
 */
export interface DeleteAccountViewProps {
  handleProfile: VoidFunctionType;
  handleQuestions: VoidFunctionType;
}
