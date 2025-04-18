import "./index.css";
import { HeaderProps } from "../../types/pageTypes";
import { useHeader } from "../../hooks/useHeader";
import { useUser } from "../../contexts/UserContext";
import { Typography, Button, Link } from "@mui/material";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";

/**
 * Props used in the Header component
 *
 * @interface UpdatedHeaderProps
 * @extends {HeaderProps}
 */
interface UpdatedHeaderProps extends HeaderProps {
  handleLogin: () => void;
  handleLogout: () => void;
}

/**
 * The header component for the Fake Stack Overflow application.
 * It is composed of a title, a search bar, and login/user info.
 * @param props with search string and handler functions
 * @returns the header component
 */
const Header = ({
  search,
  setQuestionPage,
  handleLogin,
  handleLogout,
}: UpdatedHeaderProps) => {
  /**
   * use the custom hook to manage state of search string and question page
   */
  const { val, handleInputChange, handleKeyDown } = useHeader(
    search,
    setQuestionPage
  );

  /**
   * read current user from context
   */
  const currentUser = useUser();

  return (
    <Box id="header" className="header">
      <Box></Box>
      <Typography variant="h4" className="title">
        Fake Stack Overflow
      </Typography>
      <Box className="header-right">
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
        {currentUser ? (
          <Box className="user-info">
            <Typography className="username-display">
              {currentUser.username}
            </Typography>
            <Link
              component="button"
              variant="body2"
              onClick={handleLogout}
              className="logout-link"
            >
              Logout
            </Link>
          </Box>
        ) : (
          <Button
            variant="contained"
            color="primary"
            onClick={handleLogin}
            className="login-button"
          >
            Login
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default Header;
