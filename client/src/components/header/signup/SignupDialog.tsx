import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Box,
  Link,
  Alert,
  CircularProgress
} from '@mui/material';
import { useAuth } from '../../../context/AuthContext';

interface SignupDialogProps {
  open: boolean;
  handleClose: () => void;
}

const SignupDialog: React.FC<SignupDialogProps> = ({ open, handleClose }) => {
  // State for form fields
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Form validation errors
  const [usernameError, setUsernameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  // Toggle between signup and login
  const [isSignup, setIsSignup] = useState(true);

  // Get auth context
  const { signup, login, authState, clearError } = useAuth();

  // Reset form when dialog is opened or closed
  React.useEffect(() => {
    if (open) {
      resetForm();
    }
  }, [open]);

  // Reset form and errors
  const resetForm = () => {
    setUsername('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setUsernameError('');
    setEmailError('');
    setPasswordError('');
    setConfirmPasswordError('');
    clearError();
  };

  // Toggle between signup and login forms
  const toggleAuthMode = () => {
    setIsSignup(!isSignup);
    resetForm();
  };

  // Validate form fields
  const validateForm = (): boolean => {
    let isValid = true;

    // Reset all errors
    setUsernameError('');
    setEmailError('');
    setPasswordError('');
    setConfirmPasswordError('');

    // Validate username (only for signup)
    if (isSignup) {
      if (!username) {
        setUsernameError('Username is required');
        isValid = false;
      } else if (username.length < 3) {
        setUsernameError('Username must be at least 3 characters');
        isValid = false;
      }
    }

    // Validate email
    if (!email) {
      setEmailError('Email is required');
      isValid = false;
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setEmailError('Please enter a valid email address');
        isValid = false;
      }
    }

    // Validate password
    if (!password) {
      setPasswordError('Password is required');
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      isValid = false;
    }

    // Validate confirm password (only for signup)
    if (isSignup) {
      if (!confirmPassword) {
        setConfirmPasswordError('Please confirm your password');
        isValid = false;
      } else if (password !== confirmPassword) {
        setConfirmPasswordError('Passwords do not match');
        isValid = false;
      }
    }

    return isValid;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      if (isSignup) {
        await signup(username, email, password);
      } else {
        await login(email, password);
      }

      // Close dialog if authentication was successful
      if (!authState.error) {
        handleClose();
      }
    } catch (error) {
      // Error is handled in the auth context
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
      <DialogTitle>
        {isSignup ? 'Sign Up' : 'Login'}
      </DialogTitle>
      <DialogContent>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          {authState.error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {authState.error}
            </Alert>
          )}

          {isSignup && (
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              autoComplete="username"
              autoFocus={isSignup}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              error={!!usernameError}
              helperText={usernameError}
            />
          )}

          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus={!isSignup}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={!!emailError}
            helperText={emailError}
          />

          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete={isSignup ? 'new-password' : 'current-password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={!!passwordError}
            helperText={passwordError}
          />

          {isSignup && (
            <TextField
              margin="normal"
              required
              fullWidth
              name="confirmPassword"
              label="Confirm Password"
              type="password"
              id="confirmPassword"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              error={!!confirmPasswordError}
              helperText={confirmPasswordError}
            />
          )}
        </Box>

        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Typography variant="body2">
            {isSignup ? 'Already have an account?' : 'Don\'t have an account?'}
            {' '}
            <Link
              component="button"
              variant="body2"
              onClick={toggleAuthMode}
              underline="hover"
            >
              {isSignup ? 'Login' : 'Sign Up'}
            </Link>
          </Typography>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          color="primary"
          variant="contained"
          disabled={authState.loading}
        >
          {authState.loading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            isSignup ? 'Sign Up' : 'Login'
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SignupDialog;