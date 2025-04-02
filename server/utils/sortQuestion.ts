import Question from "../models/questions";
import { IQuestion } from "../types/types";

/**
 * @description Sort strategies to retrieve questions in different orders:
 * "newest", "active", or "unanswered".
 * This utilizes the Strategy Design Pattern.
 * @type {Record<string, () => Promise<IQuestion[]>>}
 */
export const strategies: Record<string, () => Promise<IQuestion[]>> = {
  newest: async () => await Question.getNewestQuestions(),
  active: async () => await Question.getActiveQuestions(),
  unanswered: async () => await Question.getUnansweredQuestions(),
};
