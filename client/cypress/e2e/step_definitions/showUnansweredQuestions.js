import { Given, When, Then, And } from "cypress-cucumber-preprocessor/steps";
import { createQuestion, createAnswer } from "./sharedSteps";

const newQuestion1 = {
  title: "Test Question A",
  text: "Test Question A Text",
  tags: "javascript",
  user: "mks0",
};

const newQuestion2 = {
  title: "Test Question B",
  text: "Test Question B Text",
  tags: "javascript",
  user: "mks0",
};

const newAnswer = {
  username: "abc3",
  answer: "Answer Question B",
};

function verifyUnansweredOrder() {
  const qTitleByUnanswered = [newQuestion2.title, newQuestion1.title];
  cy.get(".postTitle").each(($el, index, $list) => {
    cy.wrap($el).should("contain", qTitleByUnanswered[index]);
  });
}

function verifyNewUnansweredOrder() {
  const newUnansweredOrder = [newQuestion2.title];
  cy.get(".postTitle").each(($el, index, $list) => {
    cy.wrap($el).should("contain", newUnansweredOrder[index]);
  });
}

// Scenario: Show all unanswered questions in newest order
//     Given The user has write access to the application "http://localhost:3000"
//     And The user has logged in
//     And can see the homepage "All Questions"
//     And The user has created a new question
//     And The user has created another new question
//     When The user clicks on the "Unanswered" tab
//     Then The user should see all questions in the database that are unanswered in newest order

Given("The user has write access to the application {string}", (url) => {
  cy.visit(url);
});

And("The user has logged in", () => {
  login();
});

And("can see the homepage {string}", (pageName) => {
  cy.contains(pageName);
});

And("The user has created a new question", () => {
  createQuestion(newQuestion1);
});

And("The user has created another new question", () => {
  createQuestion(newQuestion2);
});

When("The user clicks on the {string} tab", (orderName) => {
  cy.contains(orderName).click();
});

Then(
  "The user should see all questions in the database that are unanswered in newest order",
  () => {
    verifyUnansweredOrder();
  }
);

// Scenario: View questions in unanswered order after answering questions
//     Given The user has write access to the application "http://localhost:3000"
//     And The user has logged in
//     And The user has created a new question
//     And The user has created another new question
//     And answers the new question
//     When The user clicks on the "Unanswered" tab in the "Questions" page
//     Then The user should see all questions in the database that are unanswered in newest order

Given("The user has write access to the application {string}", (url) => {
  cy.visit(url);
});

And("The user has logged in", () => {
  login();
});

And("The user has created a new question", () => {
  createQuestion(newQuestion1);
});

And("The user has created another new question", () => {
  createQuestion(newQuestion2);
});

And("answers the new question", () => {
  createAnswer(newQuestion2, newAnswer);
});

When(
  "The user clicks on the {string} tab in the {string} page",
  (tabName, pageName) => {
    cy.contains(pageName).click();
    cy.contains(tabName).click();
  }
);

Then(
  "The user should see all questions in the database that are unanswered in the newest order",
  () => {
    verifyNewUnansweredOrder();
  }
);
