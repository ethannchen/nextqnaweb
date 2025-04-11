import React from "react";
import PageClass from ".";
import LoginView from "../auth/login/loginView";

/**
 * Class for the Login Page
 * The Login Page is where users can sign in to their accounts
 */
export default class LoginPageClass extends PageClass {
    getContent(): React.ReactNode {
        return <LoginView
            handleQuestions={this.handleQuestions}
            handleSignup={this.handleSignup}
        />;
    }

    getSelected(): string {
        return "";
    }
}