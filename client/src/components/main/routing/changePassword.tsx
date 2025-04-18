import React from "react";
import PageClass from ".";
import ChangePasswordView from "../auth/changePassword/changePasswordView";

/**
 * Class for the Change Password Page
 * The Change Password Page allows users to update their password
 */
export default class ChangePasswordPageClass extends PageClass {
  /**
   * Renders the ChangePasswordPage component with the necessary props.
   *
   * @returns {React.ReactNode} The rendered ChangePasswordPage component
   */
  getContent(): React.ReactNode {
    return <ChangePasswordView handleProfile={this.handleProfile} />;
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
