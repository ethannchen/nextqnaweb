/**
 * Utility functions for sanitizing user inputs
 * These functions validate and sanitize inputs, returning null if validation fails
 */

/**
 * Sanitizes and validates a username
 * Must be 3-30 alphanumeric characters or underscores
 *
 * @param username - The username to sanitize
 * @returns The sanitized username or null if invalid
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
 *
 * @param email - The email to sanitize
 * @returns The sanitized email or null if invalid
 */
export const sanitizeEmail = (email: string | undefined): string | null => {
  if (typeof email !== "string") return null;

  // Trim any whitespace and convert to lowercase
  const trimmed = email.trim().toLowerCase();

  // Validate email format (basic validation)
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed) ? trimmed : null;
};

/**
 * Sanitizes and validates a password
 * Must be at least 8 characters with at least one letter and one number
 *
 * @param password - The password to sanitize
 * @returns The sanitized password or null if invalid
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
 * Sanitizes text content to prevent XSS
 *
 * @param text - The text to sanitize
 * @returns The sanitized text or empty string if undefined
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
 * Validates a URL
 *
 * @param url - The URL to validate
 * @returns The validated URL or null if invalid
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
