import React from "react";
import PageClass, { PageClassProps } from ".";
import AnswerPage from "../answerPage/answerPageView";
import { VoidFunctionType } from "../../../types/functionTypes";

/**
 * The type definition for the constructor parameter.
 *
 * @interface AnswerPageClassProps
 * @extends {(Omit<PageClassProps, "handleNewQuestion" | "handleNewAnswer">)}
 */
interface AnswerPageClassProps
  extends Omit<PageClassProps, "handleNewQuestion" | "handleNewAnswer"> {
  qid: string;
  handleNewQuestion: VoidFunctionType;
  handleNewAnswer: VoidFunctionType;
}

/**
 * The class represents the answer page for a question.
 */
export default class AnswerPageClass extends PageClass {
  qid: string;
  handleNewQuestion: VoidFunctionType;
  handleNewAnswer: VoidFunctionType;

  /**
   * The constructor for the class set the question id,
   * and the functions to render newly created questions and answers.
   * @param props The properties of the class.
   */
  constructor(props: AnswerPageClassProps) {
    super({
      search: props.search,
      title: props.title,
      setQuestionPage: props.setQuestionPage,
      questionOrder: props.questionOrder,
      setQuestionOrder: props.setQuestionOrder,
      qid: props.qid,
      handleQuestions: props.handleQuestions,
      handleTags: props.handleTags,
      handleAnswer: props.handleAnswer,
      clickTag: props.clickTag,
      handleNewQuestion: props.handleNewQuestion,
      handleNewAnswer: props.handleNewAnswer,
      handleLogin: function (): void {
        throw new Error("Function not implemented.");
      },
      handleSignup: function (): void {
        throw new Error("Function not implemented.");
      },
      handleLogout: function (): void {
        throw new Error("Function not implemented.");
      },
      handleProfile: function (): void {
        throw new Error("Function not implemented.");
      },
      handleEditProfile: function (): void {
        throw new Error("Function not implemented.");
      },
      handleChangePassword: function (): void {
        throw new Error("Function not implemented.");
      },
      handleDeleteAccount: function (): void {
        throw new Error("Function not implemented.");
      },
    });

    this.qid = props.qid;
    this.handleNewQuestion = props.handleNewQuestion;
    this.handleNewAnswer = props.handleNewAnswer;
  }

  /**
   * Renders the AnswerPage component with the necessary props.
   *
   * @returns {React.ReactNode} The rendered AnswerPage component
   */
  getContent(): React.ReactNode {
    return (
      <AnswerPage
        qid={this.qid}
        handleNewQuestion={this.handleNewQuestion}
        handleNewAnswer={this.handleNewAnswer}
      />
    );
  }

  /**
   * Returns the identifier for the currently selected item.
   * This implementation returns an empty string, suggesting no item is selected by default.
   *
   * @returns {string} The selected item identifier (empty string in this implementation)
   */
  getSelected(): string {
    return "";
  }
}
