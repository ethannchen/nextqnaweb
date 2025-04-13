import "./commentView.css";
import Box from "@mui/material/Box";
import { Typography } from "@mui/material";
import { CommentType } from "../../../../types/entityTypes";

const Comment = (comment: CommentType) => {
  return (
    <Box className="comment">
      <Typography
        variant="subtitle2"
        id="commentText"
        className="commentText"
        display="inline"
      >
        {comment.text}
        <Typography
          className="comment_author"
          variant="subtitle2"
          display="inline"
        >
          &nbsp; - {comment.commented_by.username}
        </Typography>
      </Typography>
    </Box>
  );
};

export default Comment;
