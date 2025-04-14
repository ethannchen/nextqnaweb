import { Given, When, Then, And } from "cypress-cucumber-preprocessor/steps";
import {
  fillQuestionForm,
  fillAnswerForm,
  createAnswer,
  login,
} from "./sharedSteps";

const Q1_DESC = "Programmatically navigate using React router";
const Q2_DESC =
  "android studio save string shared preference, start activity and load the saved string";
const Q3_DESC = "Object storage for a web application";
const Q4_DESC = "Quick question about storage on android";
const A1_TXT =
  "React Router is mostly a wrapper around the history library. history handles interaction with the browser's window.history for you with its browser and hash histories. It also provides a memory history which is useful for environments that don't have a global history. This is particularly useful in mobile app development (react-native) and unit testing with Node.";
const A2_TXT =
  "On my end, I like to have a single history object that I can carry even outside components. I like to have a single history.js file that I import on demand, and just manipulate it. You just have to change BrowserRouter to Router, and specify the history prop. This doesn't change anything for you, except that you have your own history object that you can manipulate as you want. You need to install history, the library used by react-router.";

const newQuestion = {
  title: "Test Question A",
  text: "Test Question A Text",
  tags: "javascript",
};

const answers = ["Test Answer 1", A1_TXT, A2_TXT];

const newAnswer = {
  answer: answers[0],
};

function verifyAnswers() {
  cy.get(".answerText").each(($el, index) => {
    cy.contains(answers[index]);
  });
  cy.contains("carly");
  cy.contains("0 seconds ago");
}

const questions = [
  { title: Q1_DESC },
  { title: Q2_DESC },
  { title: newQuestion.title },
];

function addThreeAnswers() {
  questions.forEach((q) => {
    cy.contains("Questions").click();
    createAnswer(q, newAnswer);
  });
}

function verifyActiveOrder() {
  const qTitles = [newQuestion.title, Q2_DESC, Q1_DESC, Q4_DESC, Q3_DESC];
  cy.get(".postTitle").each(($el, index, $list) => {
    cy.wrap($el).should("contain", qTitles[index]);
  });
}

// Scenario: Created new answer should be displayed at the top of the answers page
//     Given The user has write access to the application "http://localhost:3000"
//     And The user has logged in
//     When The user clicks on a question
//     And clicks "Answer Question" button
//     And fills the answer
//     And clicks the "Post Answer" button
//     Then the answers should be in newest order in the answers page

Given("The user has write access to the application {string}", (url) => {
  cy.visit(url);
});

And("The user has logged in", () => {
  login();
});

When("The user clicks on a question", () => {
  cy.contains(Q1_DESC).click();
});

And("clicks {string} button", (buttonName) => {
  cy.contains(buttonName).click();
});

And("fills the answer", () => {
  fillAnswerForm(newAnswer);
});

And("clicks the {string} button", (buttonName) => {
  cy.contains(buttonName).click();
});

Then("the answers should be in newest order in the answers page", () => {
  verifyAnswers();
});

// Scenario Outline: Add a new answer fail with missing fields
//     Given The user has write access to the application "http://localhost:3000"
//     And The user has logged in
//     When The user clicks on a question
//     And clicks "Answer Question" button
//     And fill out the answer form with all necessary fields except the "<missingField>" field
//     And clicks the "Post Answer" button
//     Then The user should see an error message "<errorMessage>"

Given("The user has write access to the application {string}", (url) => {
  cy.visit(url);
});

And("The user has logged in", () => {
  login();
});

When("The user clicks on a question", () => {
  cy.contains(Q1_DESC).click();
});

And("clicks {string} button", (buttonName) => {
  cy.contains(buttonName).click();
});

And(
  "fill out the answer form with all necessary fields except the {string} field",
  (missingField) => {
    let a = { ...newAnswer, [missingField]: "" };
    fillAnswerForm(a);
  }
);

And("clicks the {string} button", (buttonName) => {
  cy.contains(buttonName).click();
});

Then("The user should see an error message {string}", (errorMessage) => {
  cy.contains(errorMessage, { matchCase: false });
});

// Scenario: Adding new answers to questions should make them active
//     Given The user has write access to the application "http://localhost:3000"
//     And The user has logged in
//     And The user clicks "Ask a Question" button
//     And fills out the necessary fields
//     And clicks the "Post Question" button
//     And The user answers two existing questions and the new question
//     And goes back to the "Questions" page
//     When The user clicks the "Active" tab
//     Then The user should see all questions in active order

Given("The user has write access to the application {string}", (url) => {
  cy.visit(url);
});

And("The user has logged in", () => {
  login();
});

And("The user clicks {string} button", (buttonName) => {
  cy.contains(buttonName).click();
});

And("fills out the necessary fields", () => {
  fillQuestionForm(newQuestion);
});

And("clicks the {string} button", (buttonName) => {
  cy.contains(buttonName).click();
});

And("The user answers two existing questions and the new question", () => {
  addThreeAnswers();
});

And("goes back to the {string} page", (page) => {
  cy.contains(page).click();
});

When("The user clicks the {string} tab", (tab) => {
  cy.contains(tab).click();
});

Then("The user should see all questions in active order", () =>
  verifyActiveOrder()
);
