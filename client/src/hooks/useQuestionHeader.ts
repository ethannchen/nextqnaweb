import { useState } from "react";
import { useUser } from "../contexts/UserContext";
import { VoidFunctionType } from "../types/functionTypes";

export const useQuestionHeader = (handleNewQuestion: VoidFunctionType) => {
  const currentUser = useUser();
  /** Whether to show the login-required dialog */
  const [openDialog, setOpenDialog] = useState(false);

  const onAddQuestionClick = () => {
    if (!currentUser) {
      setOpenDialog(true);
      return;
    }
    handleNewQuestion();
  };

  return { onAddQuestionClick, openDialog, setOpenDialog };
};
