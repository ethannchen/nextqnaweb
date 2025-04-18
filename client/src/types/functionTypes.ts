/**
 * This module contains all the function types used throughout the application.
 * These type definitions provide consistent interfaces for callback functions
 * that are passed as props between components.
 *
 * @module functionTypes
 */

/**
 * Represents a function that performs an action without taking any parameters
 * and doesn't return a value.
 * Commonly used for navigation, toggling state, or triggering simple actions.
 *
 * @typedef {Function} VoidFunctionType
 * @returns {void}
 */
type VoidFunctionType = () => void;

/**
 * Represents a function that sets the current page with optional search and title parameters.
 * Used for navigation to the questions page with specific filters.
 *
 * @typedef {Function} PageSetterFunctionType
 * @param {string} [search] - Optional search query to filter questions
 * @param {string} [title] - Optional title to display on the page
 * @returns {void}
 */
type PageSetterFunctionType = (search?: string, title?: string) => void;

/**
 * Represents a function that navigates to the questions page with required query and title parameters.
 * Unlike PageSetterFunctionType, both parameters are required.
 *
 * @typedef {Function} QuestionsPageQueryFuntionType
 * @param {string} query - Search query to filter questions
 * @param {string} title - Title to display on the page
 * @returns {void}
 */
type QuestionsPageQueryFuntionType = (query: string, title: string) => void;

/**
 * Represents a function that handles a click on a tag.
 * Used to filter questions by the selected tag.
 *
 * @typedef {Function} ClickTagFunctionType
 * @param {string} tagName - The name of the clicked tag
 * @returns {void}
 */
type ClickTagFunctionType = (tagName: string) => void;

/**
 * Represents a function that performs an action based on an ID parameter.
 * Typically used for selecting, editing, or viewing a specific item.
 *
 * @typedef {Function} IdFunctionType
 * @param {string} id - Unique identifier for an item
 * @returns {void}
 */
type IdFunctionType = (id: string) => void;

/**
 * Represents a function that sets the order of displayed items.
 * Used for sorting questions by different criteria (newest, active, etc.).
 *
 * @typedef {Function} OrderFunctionType
 * @param {string} order - The ordering criteria to apply
 * @returns {void}
 */
type OrderFunctionType = (order: string) => void;

/**
 * Represents a function that handles a message.
 * Used for displaying notifications, error messages, or success messages.
 *
 * @typedef {Function} MessageFunctionType
 * @param {string} message - The message content to handle
 * @returns {void}
 */
type MessageFunctionType = (message: string) => void;

/**
 * Represents a function that handles actions specific to a question.
 * Used for navigating to question details, answers, or performing question-related actions.
 *
 * @typedef {Function} QuestionIdFunctionType
 * @param {string} qid - Unique identifier for a question
 * @returns {void}
 */
type QuestionIdFunctionType = (qid: string) => void;

/**
 * Represents a general-purpose function that takes a string parameter.
 * Used for various string-based operations like input handling or filtering.
 *
 * @typedef {Function} StringFunctionType
 * @param {string} value - The string value to process
 * @returns {void}
 */
type StringFunctionType = (value: string) => void;

export type {
  VoidFunctionType,
  PageSetterFunctionType,
  ClickTagFunctionType,
  IdFunctionType,
  OrderFunctionType,
  MessageFunctionType,
  QuestionIdFunctionType,
  StringFunctionType,
  QuestionsPageQueryFuntionType,
};
