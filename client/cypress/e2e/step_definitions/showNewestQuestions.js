import { Given, When, Then, And } from "cypress-cucumber-preprocessor/steps";
import { createQuestion } from "./sharedSteps";

const Q1_TITLE = "Programmatically navigate using React router";
const Q2_TITLE =
  "android studio save string shared preference, start activity and load the saved string";
const Q3_TITLE = "Quick question about storage on android";
const Q4_TITLE = "Object storage for a web application";

const newQuestion = {
  title: "Test Question A",
  text: "Test Question A Text",
  tags: "javascript",
  user: "mks0",
};

function verifyNewestOrder() {
  const qTitleByAskDate = [Q3_TITLE, Q4_TITLE, Q2_TITLE, Q1_TITLE];
  cy.get(".postTitle").each(($el, index) => {
    cy.wrap($el).should("contain", qTitleByAskDate[index]);
  });
}

const newNewestOrder = [
  newQuestion.title,
  Q3_TITLE,
  Q4_TITLE,
  Q2_TITLE,
  Q1_TITLE,
];

function verifyNewNewestOrder() {
  cy.get(".postTitle").each(($el, index, $list) => {
    cy.wrap($el).should("contain", newNewestOrder[index]);
  });
}

// Scenario: Show all questions in newest order by default
// Given The user can access the homepage "http://localhost:3000"
// When The user is on the homepage "All Questions"
// Then The user should see all questions in the database with the most recently created first

Given("The user can access the homepage {string}", (url) => {
  cy.visit(url);
});

When("The user is on the homepage {string}", (pageName) => {
  cy.contains(pageName);
});

Then(
  "The user should see all questions in the database with the most recently created first",
  () => {
    verifyNewestOrder();
  }
);

// Scenario Outline: Return to the Newest tab after viewing questions in another order
// Given The user is viewing questions in "<currentOrder>"
// When The user clicks on the "Newest" order
// Then The user should see all questions in the database with the most recently created first

Given("The user is viewing questions in {string}", (currentOrder) => {
  cy.visit("http://localhost:3000");
  cy.contains(currentOrder).click();
});

When("The user clicks on the {string} order", (orderName) => {
  cy.contains(orderName).click();
});

Then(
  "The user should see all questions in the database with the most recently created first",
  () => {
    verifyNewestOrder();
  }
);

// Scenario: Return to Newest after viewing Tags
// Given The user is viewing the homepage "http://localhost:3000"
// When The user clicks on the "Tags" menu item
// And clicks on the "Questions" menu item
// Then The user should see all questions in the database with the most recently created first

Given("The user is viewing the homepage {string}", (url) => {
  cy.visit(url);
});

When("The user clicks on the {string} menu item", (menuItem) => {
  cy.contains(menuItem).click();
});

And("clicks on the {string} menu item", (menuItem) => {
  cy.contains(menuItem).click();
});

Then(
  "The user should see all questions in the database with the most recently created first",
  () => {
    verifyNewestOrder();
  }
);

// Scenario: View questions in newest order after asking questions
// Given The user has write access to the application "http://localhost:3000"
// And The user has logged in
// And The user has created a new question
// When The user goes back to the "Questions" page
// Then The user should see all questions in the database in new newest order

Given("The user has write access to the application {string}", (url) => {
  cy.visit(url);
});

And("The user has logged in", () => {
  login();
});

And("The user has created a new question", () => {
  createQuestion(newQuestion);
});

When("The user goes back to the {string} page", (pageName) => {
  cy.contains(pageName).click();
});

Then(
  "The user should see all questions in the database in new newest order",
  () => {
    verifyNewNewestOrder();
  }
);
