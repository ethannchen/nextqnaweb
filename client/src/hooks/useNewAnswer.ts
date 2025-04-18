import { useState } from "react";
import { useUser } from "../contexts/UserContext";
import { addAnswer } from "../services/answerService";
import { QuestionIdFunctionType } from "../types/functionTypes";

/**
 * A custom hook to create a new answer.
 * The hook also validates the input fields and displays error messages if the fields are empty.
 * If the answer is successfully created, the new answer is rendered on the question page.
 * @param qid the question id for which the answer is being created
 * @param handleAnswer the function to render the new answer on the question page
 * @returns the username, answer text, error messages, and a function to post the answer
 */
export const useNewAnswer = (
  qid: string,
  handleAnswer: QuestionIdFunctionType
) => {
  /** Current logged-in user data from context */
  const currentUser = useUser();
  /** The answer text input value */
  const [text, setText] = useState<string>("");
  /** Error message for the text field */
  const [textErr, setTextErr] = useState<string>("");

  /**
   * Validates the answer form and submits it to the API if valid.
   * After successful creation, navigates back to the question page.
   *
   * Validation checks:
   * - Answer text cannot be empty
   *
   * @async
   * @returns {Promise<void>}
   */
  const postAnswer = async () => {
    let isValid = true;

    if (!text) {
      setTextErr("Answer text cannot be empty");
      isValid = false;
    }

    if (!isValid) {
      return;
    }

    if (!currentUser) {
      return;
    }

    const answer = {
      text: text,
      ans_by: currentUser.username,
      ans_date_time: new Date(),
      votes: 0,
      voted_by: [],
      comments: [],
    };

    const res = await addAnswer(qid, answer);
    if (res && res._id) {
      handleAnswer(qid);
    }
  };

  return {
    text,
    setText,
    textErr,
    postAnswer,
  };
};
