import "./commentView.css";
import Box from "@mui/material/Box";
import { Typography } from "@mui/material";
import { CommentType } from "../../../../types/entityTypes";

const Comment = (comment: CommentType) => {
  return (
    <Box>
      <Box className="comment">
        <Typography
          variant="subtitle2"
          id="commentText"
          className="commentText"
        >
          {comment.text}
        </Typography>
        <Box className="commentAuthor">
          <Typography className="comment_author" variant="subtitle2">
            {comment.commented_by.username}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Comment;
