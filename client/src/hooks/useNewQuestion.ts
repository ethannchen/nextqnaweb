import { useState } from "react";
import { addQuestion } from "../services/questionService";
import { VoidFunctionType } from "../types/functionTypes";
import { useUser } from "../contexts/UserContext";

/**
 * A custom hook to handle the state and logic for adding a new question.
 * It creates a new question after validating the input fields and renders the new question on the home page.
 * @param handleQuestions the function to render the new question on the home page
 * @returns the state and logic required to add a new question
 */
export const useNewQuestion = (handleQuestions: VoidFunctionType) => {
  /** Current logged-in user data from context */
  const currentUser = useUser();

  /** Question title input value */
  const [title, setTitle] = useState<string>("");
  /** Question text/body input value */
  const [text, setText] = useState<string>("");
  /** Question tags input value (space-separated string) */
  const [tag, setTag] = useState<string>("");

  /** Error message for the title field */
  const [titleErr, setTitleErr] = useState<string>("");
  /** Error message for the text field */
  const [textErr, setTextErr] = useState<string>("");
  /** Error message for the tags field */
  const [tagErr, setTagErr] = useState<string>("");

  /**
   * Validates the question form and submits it to the API if valid.
   * After successful creation, navigates back to the questions page.
   *
   * Validation checks:
   * - Title cannot be empty and must be ≤ 100 characters
   * - Question text cannot be empty
   * - Must have between 1 and 5 tags
   * - Each tag must be ≤ 20 characters
   *
   * @async
   * @returns {Promise<void>}
   */
  const postQuestion = async () => {
    let isValid = true;

    if (!title) {
      setTitleErr("Title cannot be empty");
      isValid = false;
    } else if (title.length > 100) {
      setTitleErr("Title cannot be more than 100 characters");
      isValid = false;
    }

    if (!text) {
      setTextErr("Question text cannot be empty");
      isValid = false;
    }

    const tags = tag.split(" ").filter((tag) => tag.trim() !== "");
    if (tags.length === 0) {
      setTagErr("Should have at least one tag");
      isValid = false;
    } else if (tags.length > 5) {
      setTagErr("More than five tags is not allowed");
      isValid = false;
    }

    for (const tag of tags) {
      if (tag.length > 20) {
        setTagErr("New tag length cannot be more than 20");
        isValid = false;
        break;
      }
    }

    const tagObjects = tags.map((tag) => ({ name: tag }));

    if (!isValid) {
      return;
    }

    if (!currentUser) {
      return;
    }

    const question = {
      title: title,
      text: text,
      tags: tagObjects,
      asked_by: currentUser.username,
      ask_date_time: new Date(),
    };

    const res = await addQuestion(question);
    if (res && res._id) {
      handleQuestions();
    }
  };

  return {
    title,
    setTitle,
    text,
    setText,
    tag,
    setTag,
    titleErr,
    textErr,
    tagErr,
    postQuestion,
  };
};
