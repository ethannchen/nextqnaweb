import { ReactNode } from "react";
import { AnswerType, Tag } from "./entityTypes";
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

// A type definition for the props of the Header component
export interface HeaderProps {
  search: string;
  setQuestionPage: QuestionsPageQueryFuntionType;
}

// The type of the props for the AnswerPage component
export interface AnswerPageProps {
  qid: string;
  handleNewQuestion: VoidFunctionType;
  handleNewAnswer: VoidFunctionType;
}

// The props for the AnswerHeader component
export interface AnswerHeaderProps {
  ansCount: number;
  title: string;
  handleNewQuestion: VoidFunctionType;
}

// The type definition for the props of the QuestionBody component
export interface QuestionBodyProps {
  views: number;
  text: string;
  askby: string;
  meta: string;
}

// The type definition for the props of the Answer component
export interface AnswerProps {
  text: string;
  ansBy: string;
  meta: string;
  votes: number;
  voted_by: string[];
  handleVote: (aid: string) => Promise<AnswerType | undefined>;
  aid?: string;
}

// The type definition for the props of the Form component
export interface FormProps {
  children: ReactNode;
}

// The type of the props of the Input component
export interface InputProps {
  title: string;
  hint?: string;
  id: string;
  mandatory?: boolean;
  val: string;
  setState: StringFunctionType;
  err?: string;
}

// The type definition of the props of the Textarea component
export interface TextareaProps {
  title: string;
  mandatory?: boolean;
  hint?: string;
  id: string;
  val: string;
  setState: StringFunctionType;
  err?: string;
}

// The type definition for the props of the NewAnswer component
export interface NewAnswerProps {
  qid: string;
  handleAnswer: QuestionIdFunctionType;
}

// Type definition for props passed to NewQuestion component
export interface NewQuestionProps {
  handleQuestions: VoidFunctionType;
}

// Type definition for order buttons
export interface OrderButtonProps {
  message: string;
  setQuestionOrder: MessageFunctionType;
}

// Type definition for question page headers
export interface QuestionHeaderProps {
  title_text: string;
  qcnt: number;
  setQuestionOrder: MessageFunctionType;
  handleNewQuestion: VoidFunctionType;
}

// Type definition for single question
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

// Type definition for question page
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
 * A type alias representing a function that takes no parameters and returns void
 */
export type NoParamHandler = () => void;

/**
 * A type alias representing a function that takes a string parameter and returns void
 */
export type StringHandler = (param: string) => void;

/**
 * An interface representing the properties of the object needed to
 * render a page in the application.
 * This type is used to set the pageInstance of a component
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

export interface LoginViewProps {
  handleSignup: VoidFunctionType;
  handleQuestions: VoidFunctionType;
}

export interface SignupViewProps {
  handleLogin: VoidFunctionType;
  handleQuestions: VoidFunctionType;
}

export interface ProfileViewProps {
  handleEditProfile: VoidFunctionType;
  handleChangePassword: VoidFunctionType;
  handleDeleteAccount: VoidFunctionType;
}

export interface ProfileEditViewProps {
  handleProfile: VoidFunctionType;
}

export interface ChangePasswordViewProps {
  handleProfile: VoidFunctionType;
}

export interface DeleteAccountViewProps {
  handleProfile: VoidFunctionType;
  handleQuestions: VoidFunctionType;
}
