import React from "react";
import PageClass from ".";
import ProfileEditView from "../auth/profileEdit/profileEditView";

/**
 * Class for the Profile Edit Page
 * The Profile Edit Page allows users to update their profile information
 */
export default class ProfileEditPageClass extends PageClass {
    getContent(): React.ReactNode {
        return <ProfileEditView handleProfile={this.handleProfile} />;
    }

    getSelected(): string {
        return "p"; // Keep profile tab selected
    }
}