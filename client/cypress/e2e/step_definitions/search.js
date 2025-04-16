import { Given, When, Then, And } from "cypress-cucumber-preprocessor/steps";

const Q4_DESC = "Quick question about storage on android";
const Q2_DESC =
  "android studio save string shared preference, start activity and load the saved string";

// Scenario: Search for a question using text content that does not exist
//     Given The user can access the homepage "http://localhost:3000"
//     When The user search for a question using text content that does not exist
//     Then The user should see no questions displayed for that text

Given("The user can access the homepage {string}", (url) => {
  cy.visit(url);
});

When(
  "The user search for a question using text content that does not exist",
  () => {
    cy.get("#searchBar").type(`Web3{enter}`);
  }
);

Then("The user should see no questions displayed for that text", () => {
  cy.get(".postTitle").should("have.length", 0);
});

// Scenario Outline: Search string in question text
//     Given The user can access the homepage "http://localhost:3000"
//     When The user search for a string text "<searchText>"
//     Then The user should see corresponding question "<question>" in the result in newest order

Given("The user can access the homepage {string}", (url) => {
  cy.visit(url);
});

When("The user search for a string text {string}", (searchText) => {
  cy.get("#searchBar").type(`${searchText}{enter}`);
});

Then(
  "The user should see corresponding question {string} in the result in newest order",
  (question) => {
    const qTitles = [question];
    cy.get(".postTitle").each(($el, index, $list) => {
      cy.wrap($el).should("contain", qTitles[index]);
    });
  }
);

// Scenario Outline: Search a question by tag
//     Given The user can access the homepage "http://localhost:3000"
//     When The user search for a tag "<tag>"
//     Then The user should see corresponding questions "<question>" in the result in newest order

Given("The user can access the homepage {string}", (url) => {
  cy.visit(url);
});

When("The user search for a tag {string}", (tag) => {
  cy.get("#searchBar").type(`[${tag}]{enter}`);
});

Then(
  "The user should see corresponding questions {string} in the result in newest order",
  (question) => {
    const questions = question.split(";").map((q) => q.trim());
    cy.get(".postTitle").each(($el, index) => {
      cy.wrap($el).should("contain", questions[index]);
    });
  }
);

// Scenario: Search for a question using a tag that does not exist
//     Given The user can access the homepage "http://localhost:3000"
//     When The user search for a tag that does not exist
//     Then The user should see no questions displayed for that tag

Given("The user can access the homepage {string}", (url) => {
  cy.visit(url);
});

When("The user search for a tag that does not exist", (tag) => {
  cy.get("#searchBar").type("[nonExistentTag]{enter}");
});

Then("The user should see no questions displayed for that tag", () => {
  cy.get(".postTitle").should("have.length", 0);
});

// Scenario: Search by tag from new question page
//     Given The user can access the homepage "http://localhost:3000"
//     When The user search for a tag in the search bar
//     Then The user should see correct questions in the result in newest order

Given("The user can access the homepage {string}", (url) => {
  cy.visit(url);
});

When("The user search for a tag in the search bar", () => {
  cy.get("#searchBar").type("[shared-preferences]{enter}");
});

Then(
  "The user should see correct questions in the result in newest order",
  () => {
    const qTitles = [Q4_DESC, Q2_DESC];
    cy.get(".postTitle").each(($el, index, $list) => {
      cy.wrap($el).should("contain", qTitles[index]);
    });
  }
);

// Scenario: Search by text from Tags page
//     Given The user can access the homepage "http://localhost:3000"
//     And The user goes to "Tags" page
//     When The user search for a text in the search bar
//     Then The user should see correct question in the result

Given("The user can access the homepage {string}", (url) => {
  cy.visit(url);
});

And("The user goes to {string} page", (page) => {
  cy.contains(page).click();
});

When("The user search for a text in the search bar", () => {
  cy.get("#searchBar").type("40 million{enter}");
});

Then("The user should see correct question in the result", () => {
  cy.get(".postTitle").should("have.length", 1);
});
