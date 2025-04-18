/**
 * Utility functions for searching questions by tags and text content
 * These functions provide a flexible search mechanism for question filtering
 * @module searchQuestion
 */

import { IQuestion } from "../types/types";

/**
 * Extract tag references from search text
 * Tags are identified by square brackets, e.g. [javascript]
 *
 * @param {string} search - The search text containing potential tag references
 * @returns {string[]} Array of tag names without the brackets
 */
function extractTags(search: string): string[] {
  const words = search.split(/\s+/);

  // Filter words that start with '[', end with ']', and have length > 2
  const tags = words.filter((word) => {
    return word.startsWith("[") && word.endsWith("]") && word.length > 2;
  });

  return tags.map((tag) => tag.substring(1, tag.length - 1));
}

/**
 * Extract normal search words from search text
 * Filters out tag references (words in square brackets)
 *
 * @param {string} search - The search text containing potential search words
 * @returns {string[]} Array of search words (excluding tag references)
 */
function extractWords(search: string): string[] {
  const words = search.split(/\s+/);

  const filteredWords = words.filter((word) => {
    return !word.includes("[") && !word.includes("]");
  });

  return filteredWords;
}

/**
 * Filter questions by tags using AND logic
 * Questions must contain ALL specified tags to be included in results
 *
 * @param {IQuestion[]} questions - Questions to filter
 * @param {string[]} tags - Tag names to filter by
 * @returns {IQuestion[]} Questions that contain all specified tags
 */
function filterByTags(questions: IQuestion[], tags: string[]): IQuestion[] {
  const filteredQuestionsByTag = questions.filter(
    (question) =>
      tags.length === 0 ||
      (Array.isArray(question.tags) &&
        question.tags.length > 0 &&
        tags.every((tagName) =>
          question.tags.some(
            (tag) =>
              tag.name && tag.name.toLowerCase() === tagName.toLowerCase()
          )
        ))
  );
  return filteredQuestionsByTag;
}

/**
 * Filter questions by search words using OR logic
 * Questions matching ANY of the search words in title or text will be included
 *
 * @param {IQuestion[]} questions - Questions to filter
 * @param {string[]} words - Words to search for
 * @returns {IQuestion[]} Questions containing any of the specified words
 */
function filterByWords(questions: IQuestion[], words: string[]): IQuestion[] {
  const filteredQuestionsByWords = questions.filter((question) =>
    words.some((word) => {
      return (
        question.title.toLowerCase().includes(word.toLowerCase()) ||
        (question.text &&
          question.text.toLowerCase().includes(word.toLowerCase()))
      );
    })
  );
  return filteredQuestionsByWords;
}

/**
 * Search questions by text and tags using a combination of filters
 * - If both tags and words are provided, returns questions matching ANY filter
 * - If only tags are provided, returns questions matching ALL tags
 * - If only words are provided, returns questions matching ANY word
 * - If no search criteria, returns all questions unfiltered
 *
 * @param {IQuestion[]} questions - The collection of questions to search
 * @param {string} search - Search text potentially containing words and tag references
 * @returns {IQuestion[]} Filtered questions matching the search criteria
 */
export function searchQuestion(
  questions: IQuestion[],
  search: string
): IQuestion[] {
  // get search tags
  const tags = extractTags(search);
  // get search words
  const words = extractWords(search);

  const filteredQuestionsByTag = filterByTags(questions, tags);
  const filteredQuestionsByWords = filterByWords(questions, words);

  let filteredQuestions = questions;
  if (tags.length > 0 && words.length > 0) {
    filteredQuestions = filteredQuestions.filter(
      (q) =>
        filteredQuestionsByTag.some((question) => question._id === q._id) ||
        filteredQuestionsByWords.some((question) => question._id === q._id)
    );
  } else {
    if (tags.length > 0) {
      filteredQuestions = filteredQuestionsByTag;
    } else if (words.length > 0) {
      filteredQuestions = filteredQuestionsByWords;
    }
  }

  return filteredQuestions;
}
