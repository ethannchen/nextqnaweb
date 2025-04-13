import { useState } from "react";
import { useUser } from "../contexts/UserContext";

/**
 * Custom hook for the profile page functionality
 * @returns Profile state
 */
export const useProfile = () => {
  const currentUser = useUser();
  const [loading] = useState(false);
  const [error, setError] = useState("");

  // Ensure current user is available
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
