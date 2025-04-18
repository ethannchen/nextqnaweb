import Question from "../models/questions";
import { IQuestion } from "../types/types";

/**
 * A collection of sorting strategies to retrieve questions in different orders.
 * Implements the Strategy Design Pattern for flexible question sorting.
 *
 * Each strategy is an async function that returns a Promise resolving to an array of IQuestion objects.
 *
 * @property {Function} newest - Retrieves questions sorted by post date, newest first
 * @property {Function} active - Retrieves questions sorted by most recent activity
 * @property {Function} unanswered - Retrieves questions with no answers, sorted by post date
 */
export const strategies: Record<string, () => Promise<IQuestion[]>> = {
  /**
   * Retrieves all questions sorted by creation date (newest first)
   * @returns {Promise<IQuestion[]>} Questions in newest order
   */
  newest: async () => await Question.getNewestQuestions(),

  /**
   * Retrieves all questions sorted by most recent activity
   * Activity is defined by the most recent answer or, if no answers, the question creation date
   * @returns {Promise<IQuestion[]>} Questions in active order
   */
  active: async () => await Question.getActiveQuestions(),

  /**
   * Retrieves questions with no answers, sorted by creation date (newest first)
   * @returns {Promise<IQuestion[]>} Unanswered questions in newest order
   */
  unanswered: async () => await Question.getUnansweredQuestions(),
};
