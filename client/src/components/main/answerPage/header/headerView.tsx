import "./headerView.css";
import { AnswerHeaderProps } from "../../../../types/pageTypes";
import Button from "@mui/material/Button";

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
      <Button
        variant="contained"
        className="bluebtn"
        onClick={() => {
          handleNewQuestion();
        }}
      >
        Ask a Question
      </Button>
    </div>
  );
};

export default AnswerHeader;
