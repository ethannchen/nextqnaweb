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
  const [confirmText, setConfirmText] = useState("");
  const [confirmTextError, setConfirmTextError] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const updateUser = useUserUpdate();

  const validateInputs = (): boolean => {
    setConfirmTextError("");
    setError("");

    if (confirmText !== "DELETE") {
      setConfirmTextError('Please type "DELETE" to confirm');
      return false;
    }

    return true;
  };

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
