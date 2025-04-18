import { useState } from "react";
import { changePassword } from "../services/userService";
import { VoidFunctionType } from "../types/functionTypes";

/**
 * Custom hook for changing password functionality
 * @param handleProfile Navigation function to return to profile on success
 * @returns Change password state and handlers
 */
export const useChangePassword = (handleProfile: VoidFunctionType) => {
  /** Current password input value */
  const [currentPassword, setCurrentPassword] = useState("");
  /** New password input value */
  const [newPassword, setNewPassword] = useState("");
  /** Confirm password input value */
  const [confirmPassword, setConfirmPassword] = useState("");

  // Validation error states
  /** Error message for current password field */
  const [currentPasswordError, setCurrentPasswordError] = useState("");
  /** Error message for new password field */
  const [newPasswordError, setNewPasswordError] = useState("");
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
   * Validates all input fields and sets appropriate error messages.
   * Checks for:
   * - Empty fields
   * - Password length and complexity requirements
   * - Password confirmation match
   *
   * @returns {boolean} True if all inputs are valid, false otherwise
   */
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

  /**
   * Handles form submission for password change.
   * Validates inputs, calls the API, and manages success/error states.
   * On success, clears the form and navigates back to profile after a delay.
   *
   * @async
   * @returns {Promise<void>}
   */
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
