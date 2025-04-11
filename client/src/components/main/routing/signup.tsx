import React from "react";
import PageClass from ".";
import SignupView from "../auth/signup/signupView";

/**
 * Class for the Signup Page
 * The Signup Page is where users can create a new account
 */
export default class SignupPageClass extends PageClass {
    getContent(): React.ReactNode {
        return <SignupView handleLogin={this.handleLogin} handleQuestions={this.handleQuestions} />;
    }

    getSelected(): string {
        return "";
    }
}