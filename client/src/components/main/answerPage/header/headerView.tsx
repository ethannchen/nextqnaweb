import "./headerView.css";
import { AnswerHeaderProps } from "../../../../types/pageTypes";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import { Typography } from "@mui/material";

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
    <Box id="answersHeader" className="space_between right_padding">
      <Typography variant="h6" className="bold_title">
        {ansCount} answers
      </Typography>
      <Typography variant="h5" className="bold_title answer_question_title">
        {title}
      </Typography>
      <Button
        variant="contained"
        onClick={() => {
          handleNewQuestion();
        }}
      >
        Ask a Question
      </Button>
    </Box>
  );
};

export default AnswerHeader;
