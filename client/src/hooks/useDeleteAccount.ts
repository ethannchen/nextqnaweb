import { useState } from "react";
import { deleteAccount } from "../services/userService";
import { logout } from "../services/authService";
import { useUserUpdate } from "../contexts/UserContext";
import { VoidFunctionType } from "../types/functionTypes";

/**
 * Custom hook for account deletion functionality
 * @param handleQuestions Navigation function to return to homepage after deletion
 * @returns Delete account state and handlers
 */
export const useDeleteAccount = (handleQuestions: VoidFunctionType) => {
  /** The confirmation text input value ("DELETE" is required) */
  const [confirmText, setConfirmText] = useState("");
  /** Error message for confirmation text field */
  const [confirmTextError, setConfirmTextError] = useState("");
  /** Loading state during API call */
  const [loading, setLoading] = useState(false);
  /** General error message */
  const [error, setError] = useState("");

  /** Function to update user context after logout */
  const updateUser = useUserUpdate();

  /**
   * Validates the confirmation text input.
   * Checks that the user has typed "DELETE" exactly to confirm their intention.
   *
   * @returns {boolean} True if confirmation text is valid, false otherwise
   */
  const validateInputs = (): boolean => {
    setConfirmTextError("");
    setError("");

    if (confirmText !== "DELETE") {
      setConfirmTextError('Please type "DELETE" to confirm');
      return false;
    }

    return true;
  };

  /**
   * Handles the account deletion process.
   * Validates input, calls the API to delete the account, logs the user out,
   * updates the user context, and navigates to the homepage.
   *
   * @async
   * @returns {Promise<void>}
   */
  const handleDelete = async () => {
    if (!validateInputs()) return;

    setLoading(true);

    try {
      await deleteAccount();

      // Log the user out
      logout();
      updateUser(null);

      // Navigate to homepage
      handleQuestions();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(
        err.response?.data?.error ||
          "Failed to delete account. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return {
    confirmText,
    setConfirmText,
    confirmTextError,
    loading,
    error,
    handleDelete,
  };
};
