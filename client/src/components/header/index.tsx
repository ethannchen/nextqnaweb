import React, { useState } from 'react';
import SignupDialog from './signup/SignupDialog';  // Import the renamed SignupDialog component
import { HeaderProps } from "../../types/pageTypes";
import { useHeader } from "../../hooks/useHeader";
import { Typography, Button } from "@mui/material";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";

const Header = ({ search, setQuestionPage }: HeaderProps) => {
  const [openDialog, setOpenDialog] = useState(false);
  const { val, handleInputChange, handleKeyDown } = useHeader(search, setQuestionPage);

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  return (
    <Box id="header" className="header">
      <Box></Box>
      <Typography variant="h4" className="title">
        Fake Stack Overflow
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
      <Button variant="outlined" onClick={handleOpenDialog}>
        Sign Up
      </Button>
      <SignupDialog open={openDialog} handleClose={handleCloseDialog} />
    </Box>
  );
};

export default Header;
