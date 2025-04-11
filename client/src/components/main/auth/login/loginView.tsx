import React from "react";
import { useLogin } from "../../../../hooks/useLogin";
import { LoginViewProps } from "../../../../types/pageTypes";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Link,
  CircularProgress,
  Alert
} from "@mui/material";
import "./loginView.css";

/**
 * Login component that allows users to sign in
 * @param props Functions for navigation
 * @returns Login view component
 */
const LoginView: React.FC<LoginViewProps> = ({ handleQuestions, handleSignup }) => {
  const {
    email,
    setEmail,
    password,
    setPassword,
    emailError,
    passwordError,
    loading,
    error,
    handleSubmit
  } = useLogin(handleQuestions);

  return (
    <Box className="login-container">
      <Paper elevation={3} className="login-paper">
        <Typography variant="h4" className="login-title">
          Login
        </Typography>

        {error && (
          <Alert severity="error" className="login-alert">
            {error}
          </Alert>
        )}

        <form className="login-form">
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            margin="normal"
            error={!!emailError}
            helperText={emailError}
            required
          />

          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            margin="normal"
            error={!!passwordError}
            helperText={passwordError}
            required
          />

          <Button
            variant="contained"
            color="primary"
            fullWidth
            size="large"
            onClick={handleSubmit}
            disabled={loading}
            className="login-button"
          >
            {loading ? <CircularProgress size={24} /> : "Login"}
          </Button>

          <Typography className="signup-prompt">
            Don&apos;t have an account?{" "}
            <Link
              component="button"
              variant="body2"
              onClick={handleSignup}
            >
              Create a new account
            </Link>
          </Typography>
        </form>


      </Paper>
    </Box>
  );
};

export default LoginView;