import React from "react";
import PageClass from ".";
import ProfileEditView from "../auth/profileEdit/profileEditView";

/**
 * Class for the Profile Edit Page
 * The Profile Edit Page allows users to update their profile information
 */
export default class ProfileEditPageClass extends PageClass {
  /**
   * Renders the ProfileEditView component with the necessary props.
   *
   * @returns {React.ReactNode} The rendered ProfileEditView component
   */
  getContent(): React.ReactNode {
    return <ProfileEditView handleProfile={this.handleProfile} />;
  }

  /**
   * Returns the identifier for the selected navigation item.
   *
   * @returns {string} returns "p" to keep profile tab selected
   */
  getSelected(): string {
    return "p";
  }
}
