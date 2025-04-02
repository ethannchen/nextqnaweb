import { useState, ChangeEvent, KeyboardEvent } from "react";
import { QuestionsPageQueryFuntionType } from "../types/functionTypes";

/**
 * A custom hook that can be used to manage the state of the header component.
 * @param search the search query entered by the user.
 * @param setQuesitonPage the function to set the questions page to be displayed based on the search string.
 * @returns search value, input change and key down handles to help manage header component rendering
 */
export const useHeader = (
  search: string,
  setQuestionPage: QuestionsPageQueryFuntionType
) => {
  /**
   * maintains the search query entered by the user.
   */
  const [val, setVal] = useState<string>(search);

  /**
   * the handler function called when the user types in the search bar.
   * @param e the event object that triggered the function.
   */
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setVal(e.target.value);
  };

  /**
   * The handler function called when the user presses enter from the search bar.
   * @param e the event object that triggered the function.
   */
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      setQuestionPage(e.currentTarget.value, "Search Results");
    }
  };

  return {
    val,
    handleInputChange,
    handleKeyDown,
  };
};
