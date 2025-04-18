import "./headerView.css";
import { AnswerHeaderProps } from "../../../../types/pageTypes";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import { Typography } from "@mui/material";
import LoginDialog from "../../loginDialog/loginDialog";
import { useAskQuestionHeader } from "../../../../hooks/useAskQuestionHeader";

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
  /**
   * use custom hook to manage the state of new question header page
   */
  const { onAddQuestionClick, openDialog, setOpenDialog } =
    useAskQuestionHeader(handleNewQuestion);

  return (
    <Box id="answersHeader" className="space_between right_padding">
      <Typography variant="h6" className="bold_title">
        {ansCount} answers
      </Typography>
      <Typography variant="h5" className="bold_title answer_question_title">
        {title}
      </Typography>
      <Button variant="contained" onClick={onAddQuestionClick}>
        Ask a Question
      </Button>
      <LoginDialog open={openDialog} onClose={() => setOpenDialog(false)} />
    </Box>
  );
};

export default AnswerHeader;
