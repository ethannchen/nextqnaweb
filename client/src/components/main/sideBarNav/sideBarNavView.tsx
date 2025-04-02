import "./sideBarNavView.css";
import { VoidFunctionType } from "../../../types/functionTypes";
import Box from "@mui/material/Box";

// The type definition for the SideBarNav component props
interface SideBarNavProps {
  selected?: string;
  handleQuestions: VoidFunctionType;
  handleTags: VoidFunctionType;
}

/**
 * The sidebar component is composed of two buttons, one for questions and one for tags.
 * The selected prop is used to determine which button is selected.
 * The handleQuestions and handleTags functions are used to handle the click events for the buttons.
 * @param props contains the selected prop, handleQuestions function, and handleTags function
 * @returns the Sidebar component
 */
const SideBarNav = ({
  selected = "",
  handleQuestions,
  handleTags,
}: SideBarNavProps) => {
  return (
    <Box id="sideBarNav" className="sideBarNav">
      <Box
        id="menu_question"
        className={`menu_button ${selected === "q" ? "menu_selected" : ""}`}
        onClick={() => {
          handleQuestions();
        }}
      >
        Questions
      </Box>
      <Box
        id="menu_tag"
        className={`menu_button ${selected === "t" ? "menu_selected" : ""}`}
        onClick={() => {
          handleTags();
        }}
      >
        Tags
      </Box>
    </Box>
  );
};

export default SideBarNav;
