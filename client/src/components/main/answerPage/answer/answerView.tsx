import "./answerView.css";
import { AnswerProps } from "../../../../types/pageTypes";
import Box from "@mui/material/Box";
import { Typography } from "@mui/material";
import ThumbUpOutlinedIcon from "@mui/icons-material/ThumbUpOutlined";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";

/**
 * The component to render an answer in the answer page
 * @param props containing the answer text, the author of the answer and the meta data of the answer
 * @returns the Answer component
 */
const Answer = ({
  text,
  ansBy,
  meta,
  votes,
  voted_by,
  handleVote,
  aid,
}: AnswerProps) => {
  const currentUser = "carly"; //TODO: read the current user from global state
  const hasVoted = voted_by?.includes(currentUser);

  return (
    <Box className="answer right_padding">
      <Typography id="answerText" className="answerText">
        {text}
      </Typography>
      <Box onClick={() => aid && handleVote(aid)}>
        {hasVoted ? <ThumbUpIcon /> : <ThumbUpOutlinedIcon />}
        <Typography>{votes}</Typography>
      </Box>
      <Box className="answerAuthor">
        <Typography className="answer_author">{ansBy}</Typography>
        <Typography className="answer_question_meta">{meta}</Typography>
      </Box>
    </Box>
  );
};

export default Answer;
