import "./index.css";
import { HeaderProps } from "../../types/pageTypes";
import { useHeader } from "../../hooks/useHeader";
import { Typography } from "@mui/material";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";

/**
 * The header component for the Fake Stack Overflow application.
 * It is composed of a title and a search bar.
 * When the user types in the search bar and presses Enter, the page is set to display the search results.
 * @param param0 with the search string and the function to set the page to display the search results
 * @returns the header component
 */
const Header = ({ search, setQuestionPage }: HeaderProps) => {
  /**
   * use the custom hook to manage state of search string and question page
   */
  const { val, handleInputChange, handleKeyDown } = useHeader(
    search,
    setQuestionPage
  );

  return (
    <Box id="header" className="header">
      <Box></Box>
      <Typography variant="h4" className="title">
        <strong>Fake Stack Overflow</strong>
      </Typography>
      <TextField
        variant="outlined"
        size="small"
        id="searchBar"
        placeholder="Search ..."
        type="text"
        value={val}
        onChange={handleInputChange}
        InputProps={{ onKeyDown: handleKeyDown }}
      />
    </Box>
  );
};

export default Header;
