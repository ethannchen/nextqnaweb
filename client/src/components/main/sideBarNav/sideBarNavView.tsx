import "./sideBarNavView.css";
import { useUser } from "../../../contexts/UserContext";
import { VoidFunctionType } from "../../../types/functionTypes";
import Box from "@mui/material/Box";

/**
 * The type definition for the SideBarNav component props
 */
interface SideBarNavProps {
  selected?: string;
  handleQuestions: VoidFunctionType;
  handleTags: VoidFunctionType;
  handleProfile: VoidFunctionType;
}

/**
 * The sidebar component is composed of navigation buttons.
 * The selected prop is used to determine which button is selected.
 * @param props contains the selected prop and handler functions
 * @returns the Sidebar component
 */
const SideBarNav = ({
  selected = "",
  handleQuestions,
  handleTags,
  handleProfile,
}: SideBarNavProps) => {
  /**
   * read current user from context
   */
  const currentUser = useUser();

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
      {currentUser && (
        <Box
          id="menu_profile"
          className={`menu_button ${selected === "p" ? "menu_selected" : ""}`}
          onClick={() => {
            handleProfile();
          }}
        >
          Profile
        </Box>
      )}
    </Box>
  );
};

export default SideBarNav;
