import React from "react";
import PageClass, { PageClassProps } from ".";
import NewAnswer from "../newAnswer/newAnswerView";
import { IdFunctionType } from "../../../types/functionTypes";

interface NewAnswerPageClassProps
  extends Omit<PageClassProps, "qid" | "handleAnswer"> {
  qid: string;
  handleAnswer: IdFunctionType;
}

/**
 * Class for the New Answer Page
 * The New Answer Page is a page where the user can submit a new answer to a question
 */
export default class NewAnswerPageClass extends PageClass {
  qid: string;
  handleAnswer: IdFunctionType;

  // the constructor needs to set the question id and the function to render the new answer for a question
  constructor(props: NewAnswerPageClassProps) {
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
      }
    });

    this.qid = props.qid;
    this.handleAnswer = props.handleAnswer;
  }

  getContent(): React.ReactNode {
    return <NewAnswer qid={this.qid} handleAnswer={this.handleAnswer} />;
  }

  getSelected(): string {
    return "";
  }
}
