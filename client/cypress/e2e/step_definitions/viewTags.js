import { Given, When, Then, And } from "cypress-cucumber-preprocessor/steps";
import { fillQuestionForm } from "./sharedSteps";

const newQuestion = {
  title: "Test Question A",
  text: "Test Question A Text",
  tags: "test1 test2 test3",
  user: "mks1",
};

const newQuestion_2 = {
  title: "Test Question B",
  text: "Test Question B Text",
  tags: "test",
  user: "mks1",
};

const allTags = [
  "react",
  "javascript",
  "android-studio",
  "shared-preferences",
  "storage",
  "website",
];

function verifyAllTags() {
  allTags.forEach((t) => cy.contains(t, { matchCase: false }));
}

// Scenario Outline: Each tag should have correct number of questions
//     Given The user can access the homepage "http://localhost:3000"
//     When The user clicks "Tags" page
//     And The user clicks on tag "<tag>"
//     Then The user should see <questionNumber> questions for that tag
Given("The user has write access to the application {string}", (url) => {
  cy.visit(url);
});

When("The user clicks {string} page", (page) => {
  cy.contains(page).click();
});

And("The user clicks on tag {string}", (tag) => {
  cy.contains(tag).click();
});

Then("The user should see {int} questions for that tag", (questionNumber) => {
  cy.contains(`${questionNumber} questions`);
  cy.get(".postTitle").should("have.length", questionNumber);
});

// Scenario: Successfully add the tags when create a new question
//     Given The user can access the homepage "http://localhost:3000"
//     And The user clicks on "Ask a Question"
//     And fills out the necessary fields with tags
//     And clicks the "Post Question" button
//     When The user clicks "Tags" page
//     Then The user should see the new tags from the new question existing

Given("The user has write access to the application {string}", (url) => {
  cy.visit(url);
});

And("The user has logged in", () => {
  login();
});

And("The user clicks on {string}", (buttonName) => {
  cy.contains(buttonName).click();
});

And("fills out the necessary fields with tags", () => {
  fillQuestionForm(newQuestion);
});

And("clicks the {string} button", (buttonName) => {
  cy.contains(buttonName).click();
});

When("The user clicks {string} page", (page) => {
  cy.contains(page).click();
});

Then("The user should see the new tags from the new question existing", () => {
  const tags = ["test1", "test2", "test3"];
  tags.forEach((t) => cy.contains(t));
});

// Scenario: All tags should exist in Tags page
//     Given The user can access the homepage "http://localhost:3000"
//     When The user clicks "Tags" page
//     Then The user should be able to see all tags existing

Given("The user has write access to the application {string}", (url) => {
  cy.visit(url);
});

When("The user clicks {string} page", (page) => {
  cy.contains(page).click();
});

Then("The user should be able to see all tags existing", () => {
  verifyAllTags();
});

// Scenario: All question should exist in Tags page
//     Given The user can access the homepage "http://localhost:3000"
//     When The user clicks "Tags" page
//     Then The user should be able to see all questions existing

Given("The user has write access to the application {string}", (url) => {
  cy.visit(url);
});

When("The user clicks {string} page", (page) => {
  cy.contains(page).click();
});

Then("The user should be able to see all questions existing", () => {
  cy.contains("6 Tags");
  cy.contains("1 question");
  cy.contains("2 question");
});

// Scenario Outline: Correct question should exist in tags
//     Given The user can access the homepage "http://localhost:3000"
//     When The user clicks "Tags" page
//     And The user clicks on tag "<tag>"
//     Then they should be able to see question "<question>" in it

Given("The user has write access to the application {string}", (url) => {
  cy.visit(url);
});

When("The user clicks {string} page", (page) => {
  cy.contains(page).click();
});

And("The user clicks on tag {string}", (tag) => {
  cy.contains(tag).click();
});

Then("they should be able to see question {string} in it", (question) => {
  const questions = question.split(";").map((q) => q.trim());
  cy.get(".postTitle").each(($el, index) => {
    cy.wrap($el).should("contain", questions[index]);
  });
});

// Scenario: Successfully create a new question with a new tag and finds the question through tag
//     Given The user can access the homepage "http://localhost:3000"
//     And The user clicks on "Ask a Question"
//     And fills out the necessary fields with new tags
//     And clicks the "Post Question" button
//     When The user clicks "Tags" page
//     And The user clicks on the new tag name
//     Then The user should see the new question in it

Given("The user has write access to the application {string}", (url) => {
  cy.visit(url);
});

And("The user has logged in", () => {
  login();
});

And("The user clicks on {string}", (buttonName) => {
  cy.contains(buttonName).click();
});

And("fills out the necessary fields with new tags", () => {
  fillQuestionForm(newQuestion_2);
});

And("clicks the {string} button", (buttonName) => {
  cy.contains(buttonName).click();
});

When("The user clicks {string} page", (page) => {
  cy.contains(page).click();
});

And("The user clicks on the new tag name", () => {
  cy.contains("test").click();
});

Then("The user should see the new question in it", () => {
  cy.contains("Test Question B");
});

// Scenario: Clicks on a tag and the tag should be displayed for the question
//     Given The user can access the homepage "http://localhost:3000"
//     When The user clicks "Tags" page
//     And The user clicks on tag "javascript"
//     Then The user should see tag "javascript" displayed for the question

Given("The user has write access to the application {string}", (url) => {
  cy.visit(url);
});

When("The user clicks {string} page", (page) => {
  cy.contains(page).click();
});

And("The user clicks on tag {string}", (tag) => {
  cy.contains(tag).click();
});

Then("The user should see tag {string} displayed for the question", (tag) => {
  cy.get(".question_tags").each(($el, index, $list) => {
    cy.wrap($el).should("contain", tag);
  });
});

// Scenario: Clicks on a tag in homepage and the questions related with the tag are displayed
//     Given The user can access the homepage "http://localhost:3000"
//     When The user clicks on a tag button
//     Then The user should see questions related with the tag are displayed

Given("The user has write access to the application {string}", (url) => {
  cy.visit(url);
});

When("The user clicks on a tag button", () => {
  cy.get(".question_tag_button").eq(2).click();
});

Then("The user should see questions related with the tag are displayed", () => {
  cy.get(".question_tags").each(($el, index, $list) => {
    cy.wrap($el).should("contain", "storage");
  });
});
