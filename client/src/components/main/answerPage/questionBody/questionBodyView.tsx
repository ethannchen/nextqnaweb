import "./questionBodyView.css";
import { QuestionBodyProps } from "../../../../types/pageTypes";
import Box from "@mui/material/Box";
import { Typography } from "@mui/material";

/**
 * The component renders the meta data of the question displaying all answers of a question.
 * @param props containing the views, text, askby and meta data of the question
 * @returns the question body component
 */
const QuestionBody = ({ views, text, askby, meta }: QuestionBodyProps) => {
  return (
    <Box id="questionBody" className="questionBody right_padding">
      <Typography variant="h6" className="bold_title answer_question_view">
        {views} views
      </Typography>
      <Typography className="answer_question_text">{text}</Typography>
      <Box className="answer_question_right">
        <Typography className="question_author">{askby}</Typography>
        <Typography className="answer_question_meta">asked {meta}</Typography>
      </Box>
    </Box>
  );
};

export default QuestionBody;
