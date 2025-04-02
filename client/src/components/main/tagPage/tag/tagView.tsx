import "./tagView.css";
import { ClickTagFunctionType } from "../../../../types/functionTypes";
import Box from "@mui/material/Box";
import { Typography } from "@mui/material";

// The type definition for the props of the Tag component
interface TagProps {
  t: {
    name: string;
    qcnt: number;
  };
  clickTag: ClickTagFunctionType;
}

/**
 * The component that renders a single tag in the tags page.
 * Each tag has a name and the number of questions associated with it.
 * Each tag is clickable and will render the questions associated with it.
 * @param props containing the tag and the function to render the questions of a tag
 * @returns the Tag component
 */
const Tag = ({ t, clickTag }: TagProps) => {
  return (
    <Box
      className="tagNode"
      onClick={() => {
        clickTag(t.name);
      }}
    >
      <Typography className="tagName">{t.name}</Typography>
      <Typography>{t.qcnt} questions</Typography>
    </Box>
  );
};

export default Tag;
