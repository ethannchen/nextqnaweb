import React from "react";
import PageClass from ".";
import ChangePasswordView from "../auth/changePassword/changePasswordView";

/**
 * Class for the Change Password Page
 * The Change Password Page allows users to update their password
 */
export default class ChangePasswordPageClass extends PageClass {
    getContent(): React.ReactNode {
        return <ChangePasswordView handleProfile={this.handleProfile} />;
    }

    getSelected(): string {
        return "p"; // Keep profile tab selected
    }
}