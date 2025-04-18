import "./tagPageView.css";
import Tag from "./tag/tagView";
import { useTagPage } from "../../../hooks/useTagPage";
import {
  VoidFunctionType,
  ClickTagFunctionType,
} from "../../../types/functionTypes";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import { Typography } from "@mui/material";
import LoginDialog from "../loginDialog/loginDialog";

/**
 * The type definition for the props of the TagPage component
 */
interface TagPageProps {
  clickTag: ClickTagFunctionType;
  handleNewQuestion: VoidFunctionType;
}

/**
 * The component that renders all the tags in the application.
 * It composed of Tag components.
 * @param param0 containing the functions to render the questions of a tag and to add a new question
 * @returns the TagPage component
 */
const TagPage = ({ clickTag, handleNewQuestion }: TagPageProps) => {
  /**
   * use custom hook to manage the state of the tag page
   */
  const { tlist, openDialog, setOpenDialog, onAddQuestionClick } =
    useTagPage(handleNewQuestion);

  return (
    <>
      <Box className="space_between right_padding">
        <Typography className="bold_title" variant="h5">
          {tlist.length} Tags
        </Typography>
        <Typography className="bold_title" variant="h5">
          All Tags
        </Typography>
        <Button variant="contained" onClick={onAddQuestionClick}>
          Ask a Question
        </Button>
      </Box>
      <Box className="tag_list right_padding">
        {tlist.map((t, idx) => (
          <Tag key={idx} t={t} clickTag={clickTag} />
        ))}
      </Box>
      <LoginDialog open={openDialog} onClose={() => setOpenDialog(false)} />
    </>
  );
};

export default TagPage;
