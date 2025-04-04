import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      return require("./cypress/plugins/index.js")(on, config);
    },
    specPattern: [
      "cypress/e2e/**/*.feature", // For BDD tests
      "cypress/e2e/**/*.cy.js", // For regular Cypress tests
    ],
    supportFile: false,
  },
});
