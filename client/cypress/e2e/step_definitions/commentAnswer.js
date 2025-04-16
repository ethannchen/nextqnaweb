import { Given, When, Then, And } from "cypress-cucumber-preprocessor/steps";
import { login } from "./sharedSteps";

const newQuestion = {
  title: "Test Question A",
  text: "Test Question A Text",
  tags: "javascript",
};

const Q4_DESC = "Quick question about storage on android";
const newComment = "This answer is very helpul.";
const longComment = "a".repeat(501);

function fillCommentForm(comment) {
  if (comment) cy.get("#answerCommentInput").type(comment);
}

// Scenario: Unable to comment on answers if a question does not have any answers
//     Given The user has write access to the application "http://localhost:3000"
//     And The user has logged in
//     When The user clicks the "Ask a Question" button
//     And fills out the necessary fields
//     And clicks the "Post Question" button
//     And clicks into this new question
//     Then they should not see the "Add a comment" button for that question

Given("The user has write access to the application {string}", (url) => {
  cy.visit(url);
});

And("The user has logged in", () => {
  login();
});

When("The user clicks the {string} button", (buttonName) => {
  cy.contains(buttonName).click();
});

And("fills out the necessary fields", () => {
  fillQuestionForm(newQuestion);
});

And("clicks the {string} button", (buttonName) => {
  cy.contains(buttonName).click();
});

And("clicks into this new question", () => {
  cy.contains("Test Question A").click();
});

Then(
  "they should not see the {string} button for that question",
  (buttonName) => {
    cy.contains(buttonName).should("not.exist");
  }
);

// Scenario: Successful comment on answer posts
//     Given The user has write access to the application "http://localhost:3000"
//     And The user has logged in
//     When The user clicks into a question
//     And The user clicks the "Add a comment" button
//     And The user fills out the comment form
//     And The user clicks on the "Submit" button
//     Then The user should see their comment under the answer

Given("The user has write access to the application {string}", (url) => {
  cy.visit(url);
});

And("The user has logged in", () => {
  login();
});

When("The user clicks into a question", () => {
  cy.contains(Q4_DESC).click();
});

And("The user clicks the {string} button", (buttonName) => {
  cy.contains(buttonName).click();
});

And("The user fills out the comment form", () => {
  fillCommentForm(newComment);
});

And("The user clicks the {string} button", (buttonName) => {
  cy.contains(buttonName).click();
});

Then("The user should see their comment under the answer", () => {
  cy.contains(newComment);
});

// Scenario: Unable to comment if the user has not logged in
//     Given The user has read access to the application "http://localhost:3000"
//     And The user clicks into a question
//     When The user clicks the "Add a comment" button
//     Then The user should see an error message "You need to log in first."

Given("The user has read access to the application {string}", (url) => {
  cy.visit(url);
});

And("The user clicks into a question", () => {
  cy.contains(Q4_DESC).click();
});

When("The user clicks the {string} button", (buttonName) => {
  cy.contains(buttonName).click();
});

Then("The user should see an error message {string}", (errorMessage) => {
  cy.contains(errorMessage, { matchCase: false });
});

// Scenario: Unable to make empty comment on answer posts
//     Given The user has write access to the application "http://localhost:3000"
//     And The user has logged in
//     When The user clicks into a question
//     And The user clicks the "Add a comment" button
//     And The user clicks the "Submit" button
//     Then The user should see an error message "Comment cannot be empty."

Given("The user has write access to the application {string}", (url) => {
  cy.visit(url);
});

And("The user has logged in", () => {
  login();
});

When("The user clicks into a question", () => {
  cy.contains(Q4_DESC).click();
});

And("The user clicks the {string} button", (buttonName) => {
  cy.contains(buttonName).click();
});

And("The user clicks the {string} button", (buttonName) => {
  cy.contains(buttonName).click();
});

Then("The user should see an error message {string}", (errorMessage) => {
  cy.contains(errorMessage, { matchCase: false });
});

// Scenario: Unable to make comment longer than 500 characters on answer posts
//     Given The user has write access to the application "http://localhost:3000"
//     And The user has logged in
//     When The user clicks into a question
//     And The user clicks the "Add a comment" button
//     And The user fills out the comment form with more than 500 characters
//     And The user clicks the "Submit" button
//     Then The user should see an error message "Comment cannot exceed 500 characters."

Given("The user has write access to the application {string}", (url) => {
  cy.visit(url);
});

And("The user has logged in", () => {
  login();
});

When("The user clicks into a question", () => {
  cy.contains(Q4_DESC).click();
});

And("The user clicks the {string} button", (buttonName) => {
  cy.contains(buttonName).click();
});

And("The user fills out the comment form with more than 500 characters", () => {
  fillCommentForm(longComment);
});

And("The user clicks the {string} button", (buttonName) => {
  cy.contains(buttonName).click();
});

Then("The user should see an error message {string}", (errorMessage) => {
  cy.contains(errorMessage, { matchCase: false });
});
