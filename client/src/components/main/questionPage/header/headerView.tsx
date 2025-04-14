import "./headerView.css";
import OrderButton from "./orderButton/orderButtonView";
import { QuestionHeaderProps } from "../../../../types/pageTypes";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import { Typography } from "@mui/material";
import LoginDialog from "../../loginDialog/loginDialog";
import { useQuestionHeader } from "../../../../hooks/useQuestionHeader";

/**
 * A container component for th header of the page that displays a list of questions
 * @param param0 input props for the component -- the metadata
 * and the functions to handle the order of the questions and add new questions
 * @returns the container component for the header of the page that displays a list of questions
 */
const QuestionHeader = ({
  title_text,
  qcnt,
  setQuestionOrder,
  handleNewQuestion,
}: QuestionHeaderProps) => {
  const { onAddQuestionClick, openDialog, setOpenDialog } =
    useQuestionHeader(handleNewQuestion);

  return (
    <Box>
      <Box className="space_between right_padding">
        <Typography variant="h5" className="bold_title">
          {title_text}
        </Typography>
        <Button variant="contained" onClick={onAddQuestionClick}>
          Ask a Question
        </Button>
      </Box>
      <Box className="space_between right_padding">
        <Typography id="question_count">{qcnt} questions</Typography>
        <Box className="btns">
          {["Newest", "Active", "Unanswered"].map((m, idx) => (
            <OrderButton
              key={idx}
              message={m}
              setQuestionOrder={setQuestionOrder}
            />
          ))}
        </Box>
      </Box>
      <LoginDialog open={openDialog} onClose={() => setOpenDialog(false)} />
    </Box>
  );
};

export default QuestionHeader;
