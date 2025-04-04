import { Given, When, Then, And } from "cypress-cucumber-preprocessor/steps";
import { fillQuestionForm } from "./sharedSteps";

const newQuestion = {
  title: "Test Question A",
  text: "Test Question A Text",
  tags: "javascript",
  user: "mks0",
};

// Scenario Outline: Show all answers in the question page
//     Given The user can access the homepage "http://localhost:3000"
//     When The user clicks on question "<question>"
//     Then The user should see all answers "<answer>" for that question in newest order

Given("The user can access the homepage {string}", (url) => {
  cy.visit(url);
});

When("The user clicks on question {string}", (question) => {
  cy.contains(question).click();
});

Then(
  "The user should see all answers {string} for that question in newest order",
  (answer) => {
    const answers = answer.split(";").map((a) => a.trim());
    cy.get(".answerText").each(($el, index) => {
      cy.contains(answers[index]);
    });
  }
);

// Scenario: Show 0 answers when a question does not have any answer yet
//     Given The user can access the homepage "http://localhost:3000"
//     And The user clicks the "Ask a Question" button
//     And fills out the necessary fields
//     And clicks the "Post Question" button
//     When The user clicks into the newly added question
//     Then The user should see "0 answers" for that question

Given("The user can access the homepage {string}", (url) => {
  cy.visit(url);
});

And("The user clicks the {string} button", (buttonName) => {
  cy.contains(buttonName).click();
});

And("fills out the necessary fields", () => {
  fillQuestionForm(newQuestion);
});

And("clicks the {string} button", (buttonName) => {
  cy.contains(buttonName).click();
});

When("The user clicks into the newly added question", () => {
  cy.contains(newQuestion.title).click();
});

Then("The user should see {string} for that question", (answerString) => {
  cy.contains(answerString);
});
