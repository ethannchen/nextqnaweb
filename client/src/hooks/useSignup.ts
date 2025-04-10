import { useState } from "react";
import { signup } from "../services/authService";
import { VoidFunctionType } from "../types/functionTypes";

/**
 * Custom hook for the signup functionality
 * @param handleQuestions Navigation function to redirect to homepage on success
 * @returns Signup state and handlers
 */
export const useSignup = (handleQuestions: VoidFunctionType) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [usernameError, setUsernameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

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
