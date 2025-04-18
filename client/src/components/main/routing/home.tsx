import React from "react";
import PageClass from ".";
import QuestionPage from "../questionPage/questionPageView";

/**
 * The class renders the QuestionPage component.
 * The component is used to display the questions in the application
 * based on a specific order and the search query.
 */
export default class HomePageClass extends PageClass {
  /**
   * Renders the QuestionPage component with the necessary props.
   *
   * @returns {React.ReactNode} The rendered QuestionPage component
   */
  getContent(): React.ReactNode {
    return (
      <QuestionPage
        title_text={this.title}
        order={this.questionOrder.toLowerCase()}
        search={this.search}
        setQuestionOrder={this.setQuestionOrder}
        clickTag={this.clickTag}
        handleAnswer={this.handleAnswer}
        handleNewQuestion={this.handleNewQuestion}
      />
    );
  }

  /**
   * Returns the identifier for the currently selected item.
   *
   * @returns {string} The selected item identifier (empty string in this implementation)
   */
  getSelected(): string {
    return "q";
  }
}
