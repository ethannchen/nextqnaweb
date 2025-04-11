import "./answerView.css";
import { AnswerProps } from "../../../../types/pageTypes";
import Box from "@mui/material/Box";
import { Typography } from "@mui/material";
import ThumbUpOutlinedIcon from "@mui/icons-material/ThumbUpOutlined";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import LoginDialog from "../../loginDialog/loginDialog";
import { useAnswerView } from "../../../../hooks/useAnswerView";

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
  const { voteCount, hasVoted, openDialog, setOpenDialog, onVoteClick } =
    useAnswerView({ votes, voted_by, handleVote, aid });

  return (
    <Box className="answer right_padding">
      <Typography id="answerText" className="answerText">
        {text}
      </Typography>
      <Box className="vote-container" onClick={onVoteClick}>
        {hasVoted ? <ThumbUpIcon /> : <ThumbUpOutlinedIcon />}
        <Typography>{voteCount}</Typography>
      </Box>
      <Box className="answerAuthor">
        <Typography className="answer_author">{ansBy}</Typography>
        <Typography className="answer_question_meta">{meta}</Typography>
      </Box>
      <LoginDialog open={openDialog} onClose={() => setOpenDialog(false)} />
    </Box>
  );
};

export default Answer;
