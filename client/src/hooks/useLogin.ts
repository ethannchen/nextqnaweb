/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { login } from "../services/authService";
import { useUserUpdate } from "../contexts/UserContext";
import { VoidFunctionType } from "../types/functionTypes";

/**
 * Custom hook for the login functionality
 * @param handleQuestions Navigation function to redirect to homepage on success
 * @returns Login state and handlers
 */
export const useLogin = (handleQuestions: VoidFunctionType) => {
  /** Email input value */
  const [email, setEmail] = useState("");
  /** Password input value */
  const [password, setPassword] = useState("");
  /** Error message for email field */
  const [emailError, setEmailError] = useState("");
  /** Error message for password field */
  const [passwordError, setPasswordError] = useState("");
  /** Loading state during API call */
  const [loading, setLoading] = useState(false);
  /** General error message */
  const [error, setError] = useState("");

  /** Function to update user context with logged-in user data */
  const updateUser = useUserUpdate();

  /**
   * Validates the login form inputs.
   * Checks for:
   * - Email format and presence
   * - Password presence
   *
   * @returns {boolean} True if all inputs are valid, false otherwise
   */
  const validateInputs = (): boolean => {
    let isValid = true;

    // Reset previous errors
    setEmailError("");
    setPasswordError("");
    setError("");

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
    }

    return isValid;
  };

  /**
   * Handles form submission for login.
   * Validates inputs, calls the login API, updates user context on success,
   * and navigates to homepage.
   *
   * @async
   * @returns {Promise<void>}
   */
  const handleSubmit = async () => {
    if (!validateInputs()) return;

    setLoading(true);

    try {
      const response = await login({ email, password });

      // Update the user context with the logged-in user
      updateUser({
        username: response.user.username,
        email: response.user.email,
        role: response.user.role as any,
        bio: response.user.bio,
        website: response.user.website,
        createdAt: new Date(),
      });

      handleQuestions();
    } catch (err: any) {
      setError(
        err.response?.data?.error || "Failed to login. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    emailError,
    passwordError,
    loading,
    error,
    handleSubmit,
  };
};
