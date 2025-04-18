import { useState } from "react";
import { useUser } from "../contexts/UserContext";

/**
 * Custom hook for the profile page functionality
 * @returns Profile state
 */
export const useProfile = () => {
  /** Current logged-in user data from context */
  const currentUser = useUser();
  /** Loading state indicator for async operations */
  const [loading] = useState(false);
  /** Error message for authentication or data retrieval issues */
  const [error, setError] = useState("");

  /**
   * Check if user is authenticated and handle error state if not.
   * This ensures proper error handling for unauthenticated access attempts.
   */
  if (!currentUser) {
    setError("User not authenticated");
    return { error, loading, user: null };
  }

  return {
    user: currentUser,
    loading,
    error,
  };
};
