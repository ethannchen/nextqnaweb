import React from "react";
import { useDeleteAccount } from "../../../../hooks/useDeleteAccount";
import { DeleteAccountViewProps } from "../../../../types/pageTypes";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  CircularProgress,
  Alert,
} from "@mui/material";
import "./deleteAccountView.css";

/**
 * Delete account component that allows users to delete their account
 * @param props Functions for navigation after account deletion
 * @returns Delete account view component
 */
const DeleteAccountView: React.FC<DeleteAccountViewProps> = ({
  handleProfile,
  handleQuestions,
}) => {
  /**
   * use custom hook to manage the state of delete account page
   */
  const {
    confirmText,
    setConfirmText,
    confirmTextError,
    loading,
    error,
    handleDelete,
  } = useDeleteAccount(handleQuestions);

  return (
    <Box className="delete-account-container">
      <Paper elevation={3} className="delete-account-paper">
        <Typography variant="h4" className="delete-account-title">
          Delete Account
        </Typography>

        <Alert severity="warning" className="delete-account-warning">
          Warning: This action cannot be undone. All your data will be
          permanently deleted.
        </Alert>

        {error && (
          <Alert severity="error" className="delete-account-alert">
            {error}
          </Alert>
        )}

        <Typography className="delete-account-instruction">
          Please type &quot;DELETE&quot; to confirm:
        </Typography>

        <TextField
          value={confirmText}
          onChange={(e) => setConfirmText(e.target.value)}
          fullWidth
          margin="normal"
          error={!!confirmTextError}
          helperText={confirmTextError}
          disabled={loading}
        />

        <Box className="delete-account-actions">
          <Button
            variant="outlined"
            color="primary"
            onClick={handleProfile}
            disabled={loading}
            className="delete-account-cancel-button"
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            color="error"
            onClick={handleDelete}
            disabled={loading || confirmText !== "DELETE"}
            className="delete-account-button"
          >
            {loading ? <CircularProgress size={24} /> : "Delete My Account"}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default DeleteAccountView;
