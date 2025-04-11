import "./mainView.css";
import SideBarNav from "./sideBarNav/sideBarNavView";
import PageClass from "./routing";
import Box from "@mui/material/Box";

// The type definition for the Main component props.
interface MainProps {
  page: PageClass;
  handleQuestions: () => void;
  handleTags: () => void;
  handleProfile: () => void;
}

/**
 * The Main component is the main view of the application.
 * It contains the SideBarNav and the content of the page.
 * The content of the page is determined by the page object.
 * @param props contains the page object and handler functions
 * @returns the Main component.
 */
const Main = ({ page, handleQuestions, handleTags, handleProfile }: MainProps) => {
  return (
    <Box id="main" className="main">
      <SideBarNav
        selected={page.getSelected()}
        handleQuestions={handleQuestions}
        handleTags={handleTags}
        handleProfile={handleProfile}
      />
      <Box id="right_main" className="right_main">
        {page.getContent()}
      </Box>
    </Box>
  );
};

export default Main;