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
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const updateUser = useUserUpdate();

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
      console.log("User logged in successfully:", response.user);

      // Redirect to home page after a brief delay
      setTimeout(() => {
        console.log("Redirecting to home page...");
        handleQuestions();
      }, 500);
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
