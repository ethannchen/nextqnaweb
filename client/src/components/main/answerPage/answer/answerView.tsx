import "./answerView.css";
import { AnswerProps } from "../../../../types/pageTypes";
import Box from "@mui/material/Box";
import { Button, Typography } from "@mui/material";
import ThumbUpOutlinedIcon from "@mui/icons-material/ThumbUpOutlined";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import LoginDialog from "../../loginDialog/loginDialog";
import { useAnswerView } from "../../../../hooks/useAnswerView";
import Comment from "../comment/commentView";
import Input from "../../baseComponents/input/inputView";
import { useState } from "react";

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
  comments,
}: AnswerProps) => {
  const { voteCount, hasVoted, openDialog, setOpenDialog, onVoteClick } =
    useAnswerView({ votes, voted_by, handleVote, aid });
  const [comment, setComment] = useState<string>("");
  const [commentErr, setCommentErr] = useState<string>("");

  const handleComment = () => {
    console.log(comment);
  };

  return (
    <Box className="answer_container right_padding">
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
      </Box>
      <Box className="comment_container">
        {comments.length > 0 && (
          <Typography className="comment_title">Comments</Typography>
        )}
        {comments?.map((c, idx) => (
          <Comment
            key={idx}
            text={c.text}
            commented_by={c.commented_by}
            comment_date_time={c.comment_date_time}
          />
        ))}
        <Input
          title={"Add a comment"}
          mandatory={false}
          id={"answerCommentInput"}
          val={comment}
          setState={setComment}
          err={commentErr}
        />
        <Button
          variant="outlined"
          color="primary"
          size="small"
          onClick={handleComment}
        >
          {"Post Comment"}
        </Button>
      </Box>
      <LoginDialog open={openDialog} onClose={() => setOpenDialog(false)} />
    </Box>
  );
};

export default Answer;
