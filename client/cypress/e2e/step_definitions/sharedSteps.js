/**
 * The method to fill question form
 * @param {*} q - the question
 */
export const fillQuestionForm = (q) => {
  if (q.title) cy.get("#formTitleInput").type(q.title);
  if (q.text) cy.get("#formTextInput").type(q.text);
  if (q.tags) cy.get("#formTagInput").type(q.tags);
  if (q.user) cy.get("#formUsernameInput").type(q.user);
};

/**
 * The method to fill answer form
 * @param {*} a - the answer
 */
export const fillAnswerForm = (a) => {
  if (a.username) cy.get("#answerUsernameInput").type(a.username);
  if (a.answer) cy.get("#answerTextInput").type(a.answer);
};

/**
 * The method to add a new question
 * @param {*} q - the question to add
 */
export const createQuestion = (q) => {
  cy.contains("Ask a Question").click();
  fillQuestionForm(q);
  cy.contains("Post Question").click();
};

/**
 * The method to add a new answer
 * @param {*} q - the question that the answer belongs to
 *          it should have a property called title
 * @param {*} a - the answer to add
 */
export const createAnswer = (q, a) => {
  if (q.title) cy.contains(q.title).click();
  cy.contains("Answer Question").click();
  fillAnswerForm(a);
  cy.contains("Post Answer").click();
};
