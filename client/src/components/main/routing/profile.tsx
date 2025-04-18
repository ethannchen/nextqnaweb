import React from "react";
import PageClass from ".";
import ProfileView from "../auth/profile/profileView";

/**
 * Class for the Profile Page
 * The Profile Page displays the user information and profile management options
 */
export default class ProfilePageClass extends PageClass {
  /**
   * Renders the ProfileView component with the necessary props.
   *
   * @returns {React.ReactNode} The rendered ProfileView component
   */
  getContent(): React.ReactNode {
    return (
      <ProfileView
        handleEditProfile={this.handleEditProfile}
        handleChangePassword={this.handleChangePassword}
        handleDeleteAccount={this.handleDeleteAccount}
      />
    );
  }

  getSelected(): string {
    return "p"; // 'p' for profile tab selected in sidebar
  }
}
