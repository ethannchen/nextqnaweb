/**
 * Utility functions for sanitizing and validating user inputs
 * Provides consistent validation and sanitization for various input types
 * @module sanitizers
 */

/**
 * Sanitizes and validates a username
 * Ensures username follows required format rules:
 * - 3-30 characters in length
 * - Contains only alphanumeric characters and underscores
 * - No spaces or special characters
 *
 * @param {string|undefined} username - The username to sanitize
 * @returns {string|null} The sanitized username or null if invalid
 */
export const sanitizeUsername = (
  username: string | undefined
): string | null => {
  if (typeof username !== "string") return null;

  // Trim any whitespace
  const trimmed = username.trim();

  // Validate username format
  return /^[a-zA-Z0-9_]{3,30}$/.test(trimmed) ? trimmed : null;
};

/**
 * Sanitizes and validates an email address
 * Checks for proper email format and converts to lowercase
 *
 * @param {string|undefined} email - The email to sanitize
 * @returns {string|null} The sanitized email (lowercase) or null if invalid
 */
export const sanitizeEmail = (email: string | undefined): string | null => {
  if (typeof email !== "string") return null;

  const trimmed = email.trim();

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  return emailRegex.test(trimmed) ? trimmed.toLowerCase() : null;
};

/**
 * Sanitizes and validates a password
 * Ensures password meets security requirements:
 * - At least 8 characters long
 * - Contains at least one letter
 * - Contains at least one number
 * - May contain special characters
 *
 * @param {string|undefined} password - The password to sanitize
 * @returns {string|null} The sanitized password or null if invalid
 */
export const sanitizePassword = (
  password: string | undefined
): string | null => {
  if (typeof password !== "string") return null;

  // Validate password requirements
  return /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*()_+]{8,100}$/.test(password)
    ? password
    : null;
};

/**
 * Sanitizes text content to prevent XSS attacks
 * Escapes HTML special characters to prevent script injection
 *
 * @param {string|undefined} text - The text to sanitize
 * @returns {string} The sanitized text with HTML characters escaped, or empty string if undefined
 */
export const sanitizeText = (text: string | undefined): string => {
  if (typeof text !== "string") return "";

  return text
    .trim()
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};

/**
 * Validates a URL string
 * Uses URL constructor to verify proper URL format
 *
 * @param {string|undefined|null} url - The URL to validate
 * @returns {string|null} The validated URL or null if invalid
 */
export const validateUrl = (url: string | undefined | null): string | null => {
  if (!url) return null;

  try {
    // Attempt to create a URL object to validate the URL
    new URL(url);
    return url;
  } catch {
    return null;
  }
};
