import React, { useState } from 'react';
import SignupDialog from './signup/SignupDialog';  // Import the renamed SignupDialog component
import { HeaderProps } from "../../types/pageTypes";
import { useHeader } from "../../hooks/useHeader";
import Button from '@mui/material/Button';

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
    <div id="header" className="header">
      <div></div>
      <div className="title">Fake Stack Overflow</div>
      <input
        id="searchBar"
        placeholder="Search ..."
        type="text"
        value={val}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
      />
      <Button variant="outlined" onClick={handleOpenDialog}>
        Sign Up
      </Button>
      <SignupDialog open={openDialog} handleClose={handleCloseDialog} />
    </div>
  );
};

export default Header;
