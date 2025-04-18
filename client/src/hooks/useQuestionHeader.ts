import { useState } from "react";
import { useUser } from "../contexts/UserContext";
import { VoidFunctionType } from "../types/functionTypes";

/**
 * Custom hook for managing the question header component functionality.
 * Handles the "Add Question" button click behavior, checking if a user is logged in
 * and showing a login dialog if necessary before allowing question creation.
 *
 * @param {VoidFunctionType} handleNewQuestion - Function to navigate to the new question form
 * @returns {Object} Object containing state variables and handlers for the question header
 * @returns {Function} returns.onAddQuestionClick - Handler for the "Add Question" button click
 * @returns {boolean} returns.openDialog - Whether the login-required dialog is open
 * @returns {Function} returns.setOpenDialog - Setter for the dialog open state
 */
export const useQuestionHeader = (handleNewQuestion: VoidFunctionType) => {
  /** Current logged-in user data from context */
  const currentUser = useUser();
  /** Whether to show the login-required dialog */
  const [openDialog, setOpenDialog] = useState(false);

  /**
   * Handles the "Add Question" button click.
   * If the user is not logged in, shows a login dialog.
   * Otherwise, navigates to the new question form.
   *
   * @returns {void}
   */
  const onAddQuestionClick = () => {
    if (!currentUser) {
      setOpenDialog(true);
      return;
    }
    handleNewQuestion();
  };

  return { onAddQuestionClick, openDialog, setOpenDialog };
};
