import React from "react";
import PageClass from ".";
import DeleteAccountView from "../auth/deleteAccount/deleteAccountView";

/**
 * Class for the Delete Account Page
 * The Delete Account Page allows users to delete their account
 */
export default class DeleteAccountPageClass extends PageClass {
  /**
   * Renders the DeleteAccountPage component with the necessary props.
   *
   * @returns {React.ReactNode} The rendered DeleteAccountPage component
   */
  getContent(): React.ReactNode {
    return (
      <DeleteAccountView
        handleProfile={this.handleProfile}
        handleQuestions={this.handleQuestions}
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
    return "p"; // Keep profile tab selected
  }
}
