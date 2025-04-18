import React from "react";
import PageClass from ".";
import NewQuestion from "../newQuestion/newQuestionView";

/**
 * Class for the New Question Page
 * The New Question Page is a page where the user can create a new question
 */
export default class NewQuestionPageClass extends PageClass {
  /**
   * Renders the NewQuestion component with the necessary props.
   *
   * @returns {React.ReactNode} The rendered NewQuestion component
   */
  getContent(): React.ReactNode {
    return <NewQuestion handleQuestions={this.handleQuestions} />;
  }

  /**
   * Returns the identifier for the selected navigation item.
   * This implementation returns an empty string, indicating no specific nav item is selected.
   *
   * @returns {string} The selected navigation item identifier (empty string in this implementation)
   */
  getSelected(): string {
    return "";
  }
}
