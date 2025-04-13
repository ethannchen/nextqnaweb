import React from "react";
import PageClass from ".";
import DeleteAccountView from "../auth/deleteAccount/deleteAccountView";

/**
 * Class for the Delete Account Page
 * The Delete Account Page allows users to delete their account
 */
export default class DeleteAccountPageClass extends PageClass {
    getContent(): React.ReactNode {
        return <DeleteAccountView
            handleProfile={this.handleProfile}
            handleQuestions={this.handleQuestions}
        />;
    }

    getSelected(): string {
        return "p"; // Keep profile tab selected
    }
}