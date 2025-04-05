import React, { useState } from 'react';
import SignupDialog from './signup/SignupDialog';
import { HeaderProps } from "../../types/pageTypes";
import { useHeader } from "../../hooks/useHeader";
import { useAuth } from "../../context/AuthContext";
import {
  Typography,
  Button,
  Box,
  TextField,
  Avatar,
  Menu,
  MenuItem,
  IconButton,
  Tooltip
} from "@mui/material";
import { AccountCircle, ArrowDropDown } from '@mui/icons-material';
import ProfileDialog from './profile/ProfileDialog';

const Header = ({ search, setQuestionPage }: HeaderProps) => {
  // Get header hook
  const { val, handleInputChange, handleKeyDown } = useHeader(search, setQuestionPage);

  // Get auth context
  const { authState, logout } = useAuth();
  const { isAuthenticated, user } = authState;

  // Dialog states
  const [openAuthDialog, setOpenAuthDialog] = useState(false);
  const [openProfileDialog, setOpenProfileDialog] = useState(false);

  // User menu state
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const menuOpen = Boolean(anchorEl);

  // Open auth dialog
  const handleOpenAuthDialog = () => {
    setOpenAuthDialog(true);
  };

  // Close auth dialog
  const handleCloseAuthDialog = () => {
    setOpenAuthDialog(false);
  };

  // Open profile dialog
  const handleOpenProfileDialog = () => {
    setOpenProfileDialog(true);
    setAnchorEl(null);
  };

  // Close profile dialog
  const handleCloseProfileDialog = () => {
    setOpenProfileDialog(false);
  };

  // Open user menu
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  // Close user menu
  const handleCloseUserMenu = () => {
    setAnchorEl(null);
  };

  // Handle logout
  const handleLogout = async () => {
    await logout();
    handleCloseUserMenu();
  };

  // Go to home
  const handleHome = () => {
    setQuestionPage("", "All Questions");
  };

  return (
    <Box
      id="header"
      className="header"
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0.5rem 1rem',
        borderBottom: '1px solid #e0e0e0'
      }}
    >
      <Typography
        variant="h4"
        className="title"
        sx={{
          cursor: 'pointer',
          fontWeight: 'bold',
          color: '#f48024'
        }}
        onClick={handleHome}
      >
        Fake Stack Overflow
      </Typography>

      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
        <TextField
          variant="outlined"
          size="small"
          id="searchBar"
          placeholder="Search ..."
          type="text"
          value={val}
          onChange={handleInputChange}
          InputProps={{ onKeyDown: handleKeyDown }}
          sx={{ minWidth: 250 }}
        />

        {isAuthenticated ? (
          <>
            <Tooltip title="Account settings">
              <IconButton
                onClick={handleOpenUserMenu}
                size="small"
                sx={{ padding: 0.5 }}
                aria-controls={menuOpen ? 'account-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={menuOpen ? 'true' : undefined}
              >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Avatar
                    sx={{ width: 32, height: 32, bgcolor: '#f48024' }}
                    alt={user?.username}
                  >
                    {user?.username?.charAt(0).toUpperCase()}
                  </Avatar>
                  <ArrowDropDown />
                </Box>
              </IconButton>
            </Tooltip>

            <Menu
              id="account-menu"
              anchorEl={anchorEl}
              open={menuOpen}
              onClose={handleCloseUserMenu}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
              <MenuItem onClick={handleOpenProfileDialog}>
                Profile
              </MenuItem>
              <MenuItem onClick={handleLogout}>
                Logout
              </MenuItem>
            </Menu>
          </>
        ) : (
          <Button
            variant="contained"
            onClick={handleOpenAuthDialog}
            sx={{
              bgcolor: '#f48024',
              '&:hover': { bgcolor: '#da6c0c' }
            }}
          >
            Log in / Sign up
          </Button>
        )}
      </Box>

      {/* Auth Dialog */}
      <SignupDialog
        open={openAuthDialog}
        handleClose={handleCloseAuthDialog}
      />

      {/* Profile Dialog */}
      <ProfileDialog
        open={openProfileDialog}
        handleClose={handleCloseProfileDialog}
      />
    </Box>
  );
};

export default Header;