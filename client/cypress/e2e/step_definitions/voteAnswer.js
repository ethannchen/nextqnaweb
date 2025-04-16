import { Given, When, Then, And } from "cypress-cucumber-preprocessor/steps";
import { fillQuestionForm, login } from "./sharedSteps";

const newQuestion = {
  title: "Test Question A",
  text: "Test Question A Text",
  tags: "javascript",
};

const Q4_DESC = "Quick question about storage on android";
const Q2_DESC =
  "android studio save string shared preference, start activity and load the saved string";
const A3_TXT =
  "Consider using apply() instead; commit writes its data to persistent storage immediately, whereas apply will handle it in the background.";
const A4_TXT =
  "YourPreference yourPrefrence = YourPreference.getInstance(context); yourPreference.saveData(YOUR_KEY,YOUR_VALUE);";
const A5_TXT =
  "I just found all the above examples just too confusing, so I wrote my own.";

function verifyVote() {
  cy.get(".vote_count").then(($span) => {
    const initialVotes = parseInt($span.text());
    cy.get(".vote_icon_outlined").click();
    cy.get(".vote_icon_outlined").should("not.exist");
    cy.get(".vote_icon_filled").should("exist");
    cy.get(".vote_count").should(($newSpan) => {
      const newVotes = parseInt($newSpan.text());
      expect(newVotes).to.eq(initialVotes + 1);
    });
  });
}

function verifyUnVote() {
  cy.get(".vote_count").then(($span) => {
    const initialVotes = parseInt($span.text());
    cy.get(".vote_icon_filled").click();
    cy.get(".vote_icon_filled").should("not.exist");
    cy.get(".vote_icon_outlined").should("exist");
    cy.get(".vote_count").should(($newSpan) => {
      const newVotes = parseInt($newSpan.text());
      expect(newVotes).to.eq(initialVotes - 1);
    });
  });
}

function verifyAnswerOrder() {
  const aTitleByVoteAndDate = [A4_TXT, A5_TXT, A3_TXT];
  cy.get(".answerText").each(($el, index, $list) => {
    cy.wrap($el).should("contain", aTitleByVoteAndDate[index]);
  });
}

// Scenario: Unable to vote on answers if a question does not have any answers
//     Given The user has write access to the application "http://localhost:3000"
//     And The user has logged in
//     When The user clicks the "Ask a Question" button
//     And fills out the necessary fields
//     And clicks the "Post Question" button
//     And clicks into this new question
//     Then they should not see the vote icon for that question

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

Then("they should not see the vote icon for that question", () => {
  cy.contains(".vote-container").should("not.exist");
});

// Scenario: Successful vote on answer posts
//     Given The user has write access to the application "http://localhost:3000"
//     And The user has logged in
//     When The user clicks into a question
//     Then they should see the vote icon as outlined for the answer they have not voted for
//     And they should be able to click the vote icon and make the vote number increase by 1

Given("The user has write access to the application {string}", (url) => {
  cy.visit(url);
});

And("The user has logged in", () => {
  login();
});

When("The user clicks into a question", () => {
  cy.contains(Q4_DESC).click();
});

Then(
  "they should see the vote icon as outlined for the answer they have not voted for",
  () => {
    cy.get(".vote_icon_outlined").should("exist");
    cy.get(".vote_icon_filled").should("not.exist");
  }
);

And(
  "they should be able to click the vote icon and make the vote number increase by 1",
  () => {
    verifyVote();
  }
);

// Scenario: Successful unvote on answer posts
//     Given The user has write access to the application "http://localhost:3000"
//     And The user has logged in
//     And The user clicks into a question
//     And The user clicks the vote icon to vote for one answer
//     And The user clicks to see all questions again
//     When The user clicks into the same question
//     Then they should see the vote icon as filled for the answer they have already voted for
//     And they should be able to click the vote icon and make the vote number decrease by 1

Given("The user has write access to the application {string}", (url) => {
  cy.visit(url);
});

And("The user has logged in", () => {
  login();
});

When("The user clicks into a question", () => {
  cy.contains(Q4_DESC).click();
});

And("The user clicks the vote icon to vote for one answer", () => {
  cy.get(".vote_icon_outlined").click();
});

And("The user clicks to see all questions again", () => {
  cy.contains("Questions").click();
});

When("The user clicks into the same question", () => {
  cy.contains(Q4_DESC).click();
});

Then(
  "they should see the vote icon as filled for the answer they have already voted for",
  () => {
    cy.get(".vote_icon_filled").should("exist");
    cy.get(".vote_icon_outlined").should("not.exist");
  }
);

And(
  "they should be able to click the vote icon and make the vote number decrease by 1",
  () => {
    verifyUnVote();
  }
);

// Scenario: Unable to vote if the user has not logged in
//     Given The user has read access to the application "http://localhost:3000"
//     And The user clicks into a question
//     When The user clicks on the vote icon for an answer
//     Then The user should see an error message "You need to log in first."

Given("The user has read access to the application {string}", (url) => {
  cy.visit(url);
});

And("The user clicks into a question", () => {
  cy.contains(Q4_DESC).click();
});

When("The user clicks on the vote icon for an answer", () => {
  cy.get(".vote_icon_outlined").click();
});

Then("The user should see an error message {string}", (errorMessage) => {
  cy.contains(errorMessage, { matchCase: false });
});

// Scenario: The answers should be displayed in the order of vote numbers and then by answer date
//     Given The user has write access to the application "http://localhost:3000"
//     And The user has logged in
//     When The user clicks into a question with multiple answers
//     Then The answers should be displayed in order of votes and then by date

Given("The user has write access to the application {string}", (url) => {
  cy.visit(url);
});

And("The user has logged in", () => {
  login();
});

When("The user clicks into a question with multiple answers", () => {
  cy.contains(Q2_DESC).click();
});

Then(
  "The answers should be displayed in order of votes and then by date",
  () => {
    verifyAnswerOrder();
  }
);
