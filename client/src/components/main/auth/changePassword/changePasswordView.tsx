import React from "react";
import { useChangePassword } from "../../../../hooks/useChangePassword";
import { ChangePasswordViewProps } from "../../../../types/pageTypes";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  CircularProgress,
  Alert,
} from "@mui/material";
import "./changePasswordView.css";

/**
 * Change password component that allows users to update their password
 * @param props Function for navigation back to profile page
 * @returns Change password view component
 */
const ChangePasswordView: React.FC<ChangePasswordViewProps> = ({
  handleProfile,
}) => {
  /**
   * use custom hook to manage state of change password page
   */
  const {
    currentPassword,
    setCurrentPassword,
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    currentPasswordError,
    newPasswordError,
    confirmPasswordError,
    loading,
    error,
    success,
    handleSubmit,
  } = useChangePassword(handleProfile);

  return (
    <Box className="change-password-container">
      <Paper elevation={3} className="change-password-paper">
        <Typography variant="h4" className="change-password-title">
          Change Password
        </Typography>

        {error && (
          <Alert severity="error" className="change-password-alert">
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" className="change-password-alert">
            {success}
          </Alert>
        )}

        <form className="change-password-form">
          <TextField
            label="Current Password"
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            fullWidth
            margin="normal"
            error={!!currentPasswordError}
            helperText={currentPasswordError}
            required
            disabled={loading || !!success}
          />

          <TextField
            label="New Password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            fullWidth
            margin="normal"
            error={!!newPasswordError}
            helperText={
              newPasswordError ||
              "Must be at least 8 characters with uppercase, lowercase, and number"
            }
            required
            disabled={loading || !!success}
          />

          <TextField
            label="Confirm New Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            fullWidth
            margin="normal"
            error={!!confirmPasswordError}
            helperText={confirmPasswordError}
            required
            disabled={loading || !!success}
          />

          <Box className="change-password-actions">
            <Button
              variant="outlined"
              color="secondary"
              onClick={handleProfile}
              disabled={loading}
              className="change-password-button"
            >
              Cancel
            </Button>

            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              disabled={loading || !!success}
              className="change-password-button"
            >
              {loading ? <CircularProgress size={24} /> : "Update Password"}
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

export default ChangePasswordView;
