import React from "react";
import PageClass from ".";
import LoginView from "../auth/login/loginView";

/**
 * Class for the Login Page
 * The Login Page is where users can sign in to their accounts
 */
export default class LoginPageClass extends PageClass {
  /**
   * Renders the LoginView component with the necessary props.
   *
   * @returns {React.ReactNode} The rendered LoginView component
   */
  getContent(): React.ReactNode {
    return (
      <LoginView
        handleQuestions={this.handleQuestions}
        handleSignup={this.handleSignup}
      />
    );
  }

  /**
   * Returns the identifier for the selected navigation item.
   * This method can be overridden by child classes that need to control the selected tab.
   *
   * @returns {string} The identifier of the selected navigation item
   */
  getSelected(): string {
    return "";
  }
}
