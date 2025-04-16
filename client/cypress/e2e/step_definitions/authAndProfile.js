import {
  Given,
  When,
  Then,
  And,
  Before,
  After,
} from "cypress-cucumber-preprocessor/steps";

// ========= COMMON STEPS =========
Given("The application server is running at {string}", (url) => {
  cy.visit(url);
});

Given("The user navigates to the homepage", () => {
  cy.visit("http://localhost:3000");
});

// Signup helper function to be reused across tests
const signup = (
  username = "testuser",
  email = "testuser@test.com",
  password = "Testuser1",
  confirmPassword = "Testuser1"
) => {
  cy.visit("http://localhost:3000");
  cy.get(".login-button").click();
  cy.contains("Create a new account").click();
  cy.get("input[type='username']").eq(0).type(username);
  cy.get("input[type='email']").type(email);
  cy.get("input[type='password']").eq(0).type(password);
  cy.get("input[type='password']").eq(1).type(confirmPassword);
  cy.contains("Create Account").click();
};

// Login helper function to be reused across tests
const login = (email = "testuser@test.com", password = "Testuser1") => {
  cy.visit("http://localhost:3000");
  cy.get(".login-button").click();
  cy.get("#email").type(email);
  cy.get("#password").type(password);
  cy.get("#submit-login").click();
};

Given("The user is logged in", () => {
  signup();
  login();
  // Wait for login to complete and verify user is logged in
  cy.contains("testuser").should("be.visible");
});

When("The user clicks the {string} button in the header", (buttonName) => {
  cy.contains(buttonName).click();
});

When("The user clicks the {string} button", (buttonName) => {
  cy.contains(buttonName).click();
});

When("The user clicks the {string} link", (linkText) => {
  cy.contains(linkText).click();
});

When("The user clicks on {string} in the sidebar", (menuItem) => {
  cy.get("#sideBarNav").contains(menuItem).click();
});

// ========= SIGNUP STEPS =========
When("The user clicks {string}", (linkText) => {
  cy.contains(linkText).click();
});

When("The user fills out the signup form with valid details:", (dataTable) => {
  const data = dataTable.rowsHash();
  cy.get("input[type='username']").eq(0).type(data.username);
  cy.get("input[type='email']").type(data.email);
  cy.get("input[type='password']").eq(0).type(data.password);
  cy.get("input[type='password']").eq(1).type(data.confirmPassword);
});

When(
  "The user fills the signup form with {string}, {string}, {string}, and {string}",
  (username, email, password, confirmPassword) => {
    if (username) cy.get("input[type='username']").eq(0).type(username);
    if (email) cy.get("input[type='email']").type(email);
    if (password) cy.get("input[type='password']").eq(0).type(password);
    if (confirmPassword)
      cy.get("input[type='password']").eq(1).type(confirmPassword);
  }
);

Then("The user should see a success message {string}", (message) => {
  cy.contains(message).should("be.visible");
});

Then(
  "The user should be redirected to the Questions page after a brief delay",
  () => {
    // Wait for redirect
    cy.contains("All Questions", { timeout: 5000 }).should("be.visible");
  }
);

Then(
  "The user should see an error message containing {string}",
  (errorMessage) => {
    cy.contains(errorMessage, { matchCase: false }).should("be.visible");
  }
);

// ========= LOGIN STEPS =========
When("The user enters valid login credentials:", (dataTable) => {
  const data = dataTable.rowsHash();
  cy.get("#email").type(data.email);
  cy.get("#password").type(data.password);
});

When("The user enters {string} and {string}", (email, password) => {
  if (email) cy.get("#email").type(email);
  if (password) cy.get("#password").type(password);
});

Then("The user should be logged in successfully", () => {
  // Verify login success - typically check for user element and absence of login button
  cy.get(".login-button").should("not.exist");
});

Then("The user should be logged out successfully", () => {
  // Verify login success - typically check for user element and absence of login button
  cy.get(".login-button").should("exist");
});

Then(
  "The user should see their username {string} in the header",
  (username) => {
    cy.contains(username).should("be.visible");
  }
);

// ========= LOGOUT STEPS =========
Then("The user should be logged out", () => {
  // Verify logout success - typically check for login button and absence of user element
  cy.get(".login-button").should("be.visible");
});

// ========= PROFILE STEPS =========
Given("The user is viewing their profile page", () => {
  cy.get("#sideBarNav").contains("Profile").click();
  cy.contains("User Profile").should("be.visible");
});

Then("The user should see their profile information", () => {
  cy.contains("User Profile").should("be.visible");
  cy.contains("Username").should("be.visible");
  cy.contains("Email").should("be.visible");
});

Then("The profile should display the correct username", () => {
  cy.contains("Username").parent().contains("testuser").should("be.visible");
});

Then("The profile should display the correct email", () => {
  cy.contains("Email")
    .parent()
    .contains("testuser@test.com")
    .should("be.visible");
});

When("The user updates their bio to {string}", (bio) => {
  cy.get("#bio").type(bio);
});

Then(
  "The user should be redirected to the profile page showing the updated bio",
  () => {
    cy.contains("User Profile").should("be.visible");
    cy.contains("Bio")
      .parent()
      .contains("This is my new bio")
      .should("be.visible");
  }
);

And("The user should be redirected to the profile page", () => {
  cy.contains("User Profile").should("be.visible");
});

When("The user enters the following password information:", (dataTable) => {
  const data = dataTable.rowsHash();
  cy.get("input[type='password']").eq(0).type(data.currentPassword);
  cy.get("input[type='password']").eq(1).type(data.newPassword);
  cy.get("input[type='password']").eq(2).type(data.confirmPassword);
});

Then(
  "The user should be prompted to confirm deletion by typing {string}",
  (confirmText) => {
    cy.contains(`Please type "${confirmText}" to confirm`).should("be.visible");
  }
);

Then("The {string} button should be disabled", (buttonText) => {
  cy.contains(buttonText).should("be.disabled");
});

When("The user enters {string} in the confirmation field", (text) => {
  cy.get("input").eq(1).type(text);
});

Then("The {string} button should be enabled", (buttonText) => {
  cy.contains(buttonText).should("not.be.disabled");
});
