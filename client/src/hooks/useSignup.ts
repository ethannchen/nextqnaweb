import { useState } from "react";
import { signup } from "../services/authService";
import { VoidFunctionType } from "../types/functionTypes";

/**
 * Custom hook for the signup functionality
 * @param handleQuestions Navigation function to redirect to homepage on success
 * @returns Signup state and handlers
 */
export const useSignup = (handleQuestions: VoidFunctionType) => {
  // Form input states
  /** Username input value */
  const [username, setUsername] = useState("");
  /** Email input value */
  const [email, setEmail] = useState("");
  /** Password input value */
  const [password, setPassword] = useState("");
  /** Confirm password input value */
  const [confirmPassword, setConfirmPassword] = useState("");

  // Validation error states
  /** Error message for username field */
  const [usernameError, setUsernameError] = useState("");
  /** Error message for email field */
  const [emailError, setEmailError] = useState("");
  /** Error message for password field */
  const [passwordError, setPasswordError] = useState("");
  /** Error message for confirm password field */
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  // Form status states
  /** Loading state during API call */
  const [loading, setLoading] = useState(false);
  /** General error message */
  const [error, setError] = useState("");
  /** Success message */
  const [success, setSuccess] = useState("");

  /**
   * Validates all form input fields and sets appropriate error messages.
   * Checks for:
   * - Username: Required, 3-30 characters, alphanumeric + underscores only
   * - Email: Required, valid email format
   * - Password: Required, min 8 characters, contains uppercase, lowercase, and number
   * - Confirm password: Matches password
   *
   * @returns {boolean} True if all inputs are valid, false otherwise
   */
  const validateInputs = (): boolean => {
    let isValid = true;

    // Reset previous errors
    setUsernameError("");
    setEmailError("");
    setPasswordError("");
    setConfirmPasswordError("");
    setError("");

    // Validate username
    if (!username.trim()) {
      setUsernameError("Username is required");
      isValid = false;
    } else if (username.length < 3 || username.length > 30) {
      setUsernameError("Username must be between 3 and 30 characters");
      isValid = false;
    } else if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      setUsernameError(
        "Username can only contain letters, numbers, and underscores"
      );
      isValid = false;
    }

    // Validate email
    if (!email.trim()) {
      setEmailError("Email is required");
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError("Please enter a valid email address");
      isValid = false;
    }

    // Validate password
    if (!password) {
      setPasswordError("Password is required");
      isValid = false;
    } else if (password.length < 8) {
      setPasswordError("Password must be at least 8 characters long");
      isValid = false;
    } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      setPasswordError(
        "Password must contain at least one uppercase letter, one lowercase letter, and one number"
      );
      isValid = false;
    }

    // Validate password confirmation
    if (password !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match");
      isValid = false;
    }

    return isValid;
  };

  /**
   * Handles form submission for user signup.
   * Validates inputs, calls the API to create the account,
   * sets success message, and navigates to homepage after a delay.
   *
   * @async
   * @returns {Promise<void>}
   */
  const handleSubmit = async () => {
    if (!validateInputs()) return;

    setLoading(true);

    try {
      await signup({ username, email, password });
      setSuccess("Account created successfully! You can now log in.");

      // Redirect to home page after a brief delay
      setTimeout(() => {
        handleQuestions();
      }, 2000);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(
        err.response?.data?.error ||
          "Failed to create account. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return {
    username,
    setUsername,
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    usernameError,
    emailError,
    passwordError,
    confirmPasswordError,
    loading,
    error,
    success,
    handleSubmit,
  };
};
