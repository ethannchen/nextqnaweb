import { useState } from "react";
import { changePassword } from "../services/userService";
import { VoidFunctionType } from "../types/functionTypes";

/**
 * Custom hook for changing password functionality
 * @param handleProfile Navigation function to return to profile on success
 * @returns Change password state and handlers
 */
export const useChangePassword = (handleProfile: VoidFunctionType) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [currentPasswordError, setCurrentPasswordError] = useState("");
  const [newPasswordError, setNewPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const validateInputs = (): boolean => {
    let isValid = true;

    // Reset previous errors
    setCurrentPasswordError("");
    setNewPasswordError("");
    setConfirmPasswordError("");
    setError("");

    // Validate current password
    if (!currentPassword) {
      setCurrentPasswordError("Current password is required");
      isValid = false;
    }

    // Validate new password
    if (!newPassword) {
      setNewPasswordError("New password is required");
      isValid = false;
    } else if (newPassword.length < 8) {
      setNewPasswordError("Password must be at least 8 characters long");
      isValid = false;
    } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(newPassword)) {
      setNewPasswordError(
        "Password must contain at least one uppercase letter, one lowercase letter, and one number"
      );
      isValid = false;
    }

    // Validate password confirmation
    if (newPassword !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match");
      isValid = false;
    }

    return isValid;
  };

  const handleSubmit = async () => {
    if (!validateInputs()) return;

    setLoading(true);

    try {
      await changePassword({
        currentPassword,
        newPassword,
      });

      setSuccess("Password changed successfully!");

      // Clear the form
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      // Return to profile page after a brief delay
      setTimeout(() => {
        handleProfile();
      }, 1500);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(
        err.response?.data?.error ||
          "Failed to change password. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return {
    currentPassword,
    setCurrentPassword,
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    currentPasswordError,
    newPasswordError,
    confirmPasswordError,
    loading,
    error,
    success,
    handleSubmit,
  };
};
