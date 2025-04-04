/**
 * Cypress test to enforce the design rule that native HTML elements
 *              like <input> and <button> should not be used directly in the UI.
 *              Ensures that only Material UI components (e.g., <TextField>, <Button>)
 *              are rendered in the application instead of raw HTML elements.
 */
describe("UI should not use native HTML inputs or buttons", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000");
  });

  it("should not have any native <input> elements", () => {
    cy.get("input").should("not.exist");
  });

  it("should not have any native <button> elements", () => {
    cy.get("button").should("not.exist");
  });

  it("should not have any native <div> elements", () => {
    cy.get("div:not([id]):not([class])").should("not.exist");
  });
});

export {};
