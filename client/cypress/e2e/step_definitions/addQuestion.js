import { Given, When, Then, And } from "cypress-cucumber-preprocessor/steps";
import { fillQuestionForm, createQuestion, createAnswer } from "./sharedSteps";

const Q4_DESC = "Quick question about storage on android";
const Q3_DESC = "Object storage for a web application";
const Q2_DESC =
  "android studio save string shared preference, start activity and load the saved string";
const Q1_DESC = "Programmatically navigate using React router";

const newQuestion = {
  title: "Test Question A",
  text: "Test Question A Text",
  tags: "javascript",
  user: "mks0",
};

const newQuestionA = {
  title: "Test Question A",
  text: "Test Question A Text",
  tags: "javascript",
  user: "mks1",
};

const newQuestionB = {
  title: "Test Question B",
  text: "Test Question B Text",
  tags: "javascript",
  user: "mks2",
};

const newQuestionC = {
  title: "Test Question C",
  text: "Test Question C Text",
  tags: "javascript",
  user: "mks3",
};

const questions = [newQuestionA, newQuestionB, newQuestionC];

function postThreeQuestions() {
  questions.forEach((q) => {
    createQuestion(q);
  });
}

const answer = { username: "abc3", answer: "Answer Question A" };

function verifyMetaData(q) {
  cy.get(".postTitle").first().should("contain", q.title);
  cy.get(".question_author").first().should("contain", q.user);
  cy.get(".question_meta").first().should("contain", "0 seconds");
}

const qTitlesAll = [
  "Test Question C",
  "Test Question B",
  "Test Question A",
  Q4_DESC,
  Q3_DESC,
  Q2_DESC,
  Q1_DESC,
];

function verifyAllQuestions() {
  cy.get(".postTitle").each(($el, index, $list) => {
    cy.wrap($el).should("contain", qTitlesAll[index]);
  });
}

const qTitlesUnanswered = [
  "Test Question C",
  "Test Question B",
  "Test Question A",
];

function verifyUnansweredQuestions() {
  cy.get(".postTitle").each(($el, index, $list) => {
    cy.wrap($el).should("contain", qTitlesUnanswered[index]);
  });
}

// Scenario: Add a new question successfully
//     Given The user has write access to the application "http://localhost:3000"
//     When The user clicks the "Ask a Question" button
//     And fills out the necessary fields
//     And clicks the "Post Question" button
//     Then The user should see the new question in the All Questions page with the metadata information

Given("The user has write access to the application {string}", (url) => {
  cy.visit(url);
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

Then(
  "The user should see the new question in the All Questions page with the metadata information",
  () => {
    cy.contains("All Questions");
    verifyMetaData(newQuestion);
  }
);

// Scenario Outline: Add a new question fail with missing fields
//     Given The user has write access to the application "http://localhost:3000"
//     When The user clicks the "Ask a Question" button
//     And fill out form with all necessary fields except the "<missingField>" field
//     And clicks the "Post Question" button
//     Then The user should see an error message "<errorMessage>"
//     And the user should see the "Post Question" button

Given("The user has write access to the application {string}", (url) => {
  cy.visit(url);
});

When("The user clicks the {string} button", (buttonName) => {
  cy.contains(buttonName).click();
});

And(
  "fill out form with all necessary fields except the {string} field",
  (missingField) => {
    let q = { ...newQuestion, [missingField]: "" };
    fillQuestionForm(q);
  }
);

And("clicks the {string} button", (buttonName) => {
  cy.contains(buttonName).click();
});

Then("The user should see an error message {string}", (errorMessage) => {
  cy.contains(errorMessage, { matchCase: false });
});

And("The user should see the {string} button", (buttonName) => {
  cy.contains(buttonName);
});

// Scenario: Add questions and verify their sequences in Unanswered page
// Given The user has write access to the application "http://localhost:3000"
// And The user asks three questions
// And The user answers the first question
// When The user goes to "Questions" page
// And clicks "Unanswered" tab
// Then The user should see two questions in newest order

Given("The user has write access to the application {string}", (url) => {
  cy.visit(url);
});

And("The user asks three questions", () => {
  postThreeQuestions();
});

And("The user answers the first question", () => {
  createAnswer(newQuestionA, answer);
});

When("The user goes to {string} page", (page) => {
  cy.contains(page).click();
});

And("clicks {string} tab", (tab) => {
  cy.contains(tab).click();
});

Then("The user should see two questions in newest order", () => {
  const qTitles = ["Test Question C", "Test Question B"];
  cy.get(".postTitle").each(($el, index, $list) => {
    cy.wrap($el).should("contain", qTitles[index]);
  });
});

// Scenario: Adds multiple questions one by one and verify them in All Questions
// Given The user has write access to the application "http://localhost:3000"
// And The user asks three questions
// When The user goes back to the home page "Fake Stack Overflow"
// Then The user should see all questions including new questions in newest order
// And The user clicks "Unanswered" tab
// And The user should see three questions in newest order

Given("The user has write access to the application {string}", (url) => {
  cy.visit(url);
});

And("The user asks three questions", () => {
  postThreeQuestions();
});

When("The user goes back to the home page {string}", (homePage) => {
  cy.contains(homePage);
});

Then(
  "The user should see all questions including new questions in newest order",
  () => {
    verifyAllQuestions();
  }
);

And("The user clicks {string} tab", (tab) => {
  cy.contains(tab).click();
});

And("The user should see three questions in newest order", () => {
  verifyUnansweredQuestions();
});
