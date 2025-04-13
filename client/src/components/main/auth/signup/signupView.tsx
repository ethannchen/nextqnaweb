import React from "react";
import { useSignup } from "../../../../hooks/useSignup";
import { SignupViewProps } from "../../../../types/pageTypes";
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
import "./signupView.css";

/**
 * Signup component that allows users to create a new account
 * @param props Functions for navigation
 * @returns Signup view component
 */
const SignupView: React.FC<SignupViewProps> = ({ handleLogin, handleQuestions }) => {
    const {
        username,
        setUsername,
        email,
        setEmail,
        password,
        setPassword,
        confirmPassword,
        setConfirmPassword,
        usernameError,
        emailError,
        passwordError,
        confirmPasswordError,
        loading,
        error,
        success,
        handleSubmit
    } = useSignup(handleQuestions);

    return (
        <Box className="signup-container">
            <Paper elevation={3} className="signup-paper">
                <Typography variant="h4" className="signup-title">
                    Create an Account
                </Typography>

                {error && (
                    <Alert severity="error" className="signup-alert">
                        {error}
                    </Alert>
                )}

                {success && (
                    <Alert severity="success" className="signup-alert">
                        {success}
                    </Alert>
                )}

                <form className="signup-form">
                    <TextField
                        label="Username"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        fullWidth
                        margin="normal"
                        error={!!usernameError}
                        helperText={usernameError}
                        required
                        disabled={loading || !!success}
                    />

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
                        disabled={loading || !!success}
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
                        disabled={loading || !!success}
                    />

                    <TextField
                        label="Confirm Password"
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

                    <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        size="large"
                        onClick={handleSubmit}
                        disabled={loading || !!success}
                        className="signup-button"
                    >
                        {loading ? <CircularProgress size={24} /> : "Create Account"}
                    </Button>

                    <Typography className="login-prompt">
                        Already have an account?{" "}
                        <Link
                            component="button"
                            variant="body2"
                            onClick={handleLogin}
                            disabled={loading || !!success}
                        >
                            Login
                        </Link>
                    </Typography>
                </form>


            </Paper>
        </Box>
    );
};

export default SignupView;