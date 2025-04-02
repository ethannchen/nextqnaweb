import { IQuestion } from "../types/types";

/**
 * Extract tags from search text
 * @param search - search text
 * @returns array of tag names
 */
function extractTags(search: string): string[] {
  return [...search.matchAll(/\[([^\]]+)\]/g)].map((match) => match[1]);
}

/**
 * Extract search words from search text
 * @param search - search text
 * @returns array of words
 */
function extractWords(search: string): string[] {
  return search
    .replace(/\[[^\]]+\]/g, "")
    .trim()
    .split(/\s+/)
    .filter((word) => word !== "");
}

/**
 * Helper method to filter question by tags
 * @param questions - questions to filter
 * @param tags - tags to be used for filtering
 * @returns filtered questions
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
 * Helper method to filter question by words
 * @param questions - questions to filter
 * @param words - words to be used for filtering
 * @returns filtered questions
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
 * method to filter questions by search text and tags
 * @param questions - the questions to search from
 * @param search - search text
 * @returns filtered questions
 */
export function searchQuestion(
  questions: IQuestion[],
  search: string
): IQuestion[] {
  // get search tags
  const tags = extractTags(search);
  // get search words
  const words = extractWords(search);

  let filteredQuestionsByTag = filterByTags(questions, tags);
  let filteredQuestionsByWords = filterByWords(questions, words);

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
