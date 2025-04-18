import React from "react";
import PageClass from ".";
import SignupView from "../auth/signup/signupView";

/**
 * Class for the Signup Page
 * The Signup Page is where users can create a new account
 */
export default class SignupPageClass extends PageClass {
  /**
   * Renders the SignupView component with the necessary props.
   *
   * @returns {React.ReactNode} The rendered SignupView component
   */
  getContent(): React.ReactNode {
    return (
      <SignupView
        handleLogin={this.handleLogin}
        handleQuestions={this.handleQuestions}
      />
    );
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
