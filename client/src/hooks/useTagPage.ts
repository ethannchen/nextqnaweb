import { useEffect, useState } from "react";
import { useUser } from "../contexts/UserContext";
import { getTagsWithQuestionNumber } from "../services/tagService";
import { TagResponseType } from "../types/entityTypes";
import { VoidFunctionType } from "../types/functionTypes";

/**
 * The custom hook to handle the state and logic for fetching tags with the number of questions associated with each tag.
 * The interacts with the tags service.
 * @returns the list of tags with the number of questions associated with each tag
 */
export const useTagPage = (handleNewQuestion: VoidFunctionType) => {
  /**
   * manage the state of the tag list on tag page
   */
  const [tlist, setTlist] = useState<TagResponseType[]>([]);
  /** Current logged-in user data from context */
  const currentUser = useUser();
  /** Whether to show the login-required dialog */
  const [openDialog, setOpenDialog] = useState(false);

  /**
   * the effect interacts with the tag service to fetch the tags with the number of questions associated with each tag.
   *
   * It has no dependencies and runs only once when the component renders.
   */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getTagsWithQuestionNumber();
        setTlist(res || []);
      } catch (e) {
        console.error("Error fetching tags:", e);
      }
    };

    fetchData();
  }, []);

  /**
   * Handles the "Add a Question" button click.
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

  return { tlist, openDialog, setOpenDialog, onAddQuestionClick };
};
