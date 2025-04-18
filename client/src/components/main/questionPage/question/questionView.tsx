import "./questionView.css";
import { getMetaData } from "../../../../utils";
import { QuestionProps } from "../../../../types/pageTypes";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { Typography } from "@mui/material";

/**
 * A component to display a question
 * @param param0 the props for the component -- data for the question
 * and the functuions that will be called when a user interacts with the question
 * @returns a question to be displayed
 */
const Question = ({ q, clickTag, handleAnswer }: QuestionProps) => {
  return (
    <Box
      className="question right_padding"
      onClick={() => {
        handleAnswer(q._id);
      }}
    >
      <Box className="postStats">
        <Typography>{q.answers.length || 0} answers</Typography>
        <Typography>{q.views} views</Typography>
      </Box>
      <Box className="question_mid">
        <Typography className="postTitle">{q.title}</Typography>
        <Box className="question_tags">
          {q.tags.map((tag, idx) => {
            return (
              <Button
                variant="contained"
                size="small"
                key={idx}
                className="question_tag_button"
                onClick={(e) => {
                  e.stopPropagation();
                  clickTag(tag.name);
                }}
              >
                {tag.name}
              </Button>
            );
          })}
        </Box>
      </Box>
      <Box className="lastActivity">
        <Typography className="question_author">{q.asked_by}</Typography>
        <Typography>&nbsp;</Typography>
        <Typography className="question_meta">
          asked {getMetaData(new Date(q.ask_date_time))}
        </Typography>
      </Box>
    </Box>
  );
};

export default Question;
