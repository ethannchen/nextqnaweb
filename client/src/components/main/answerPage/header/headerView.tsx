import "./headerView.css";
import { AnswerHeaderProps } from "../../../../types/pageTypes";

/**
 * The header of the answer page
 * @param props contains the number of answers, the title of the question and the function to post a new question
 * @returns the AnswerHeader component
 */
const AnswerHeader = ({
  ansCount,
  title,
  handleNewQuestion,
}: AnswerHeaderProps) => {
  return (
    <div id="answersHeader" className="space_between right_padding">
      <div className="bold_title">{ansCount} answers</div>
      <div className="bold_title answer_question_title">{title}</div>
      <button
        className="bluebtn"
        onClick={() => {
          handleNewQuestion();
        }}
      >
        Ask a Question
      </button>
    </div>
  );
};

export default AnswerHeader;
