import React from "react";
import { useProfileEdit } from "../../../../hooks/useProfileEdit";
import { ProfileEditViewProps } from "../../../../types/pageTypes";
import {
    Box,
    Typography,
    TextField,
    Button,
    Paper,
    CircularProgress,
    Alert
} from "@mui/material";
import "./profileEditView.css";

/**
 * Profile edit component that allows users to update their profile information
 * @param props Function for navigation back to profile page
 * @returns Profile edit view component
 */
const ProfileEditView: React.FC<ProfileEditViewProps> = ({ handleProfile }) => {
    const {
        username,
        setUsername,
        email,
        setEmail,
        bio,
        setBio,
        website,
        setWebsite,
        usernameError,
        emailError,
        bioError,
        websiteError,
        loading,
        error,
        success,
        handleSubmit
    } = useProfileEdit(handleProfile);

    return (
        <Box className="profile-edit-container">
            <Paper elevation={3} className="profile-edit-paper">
                <Typography variant="h4" className="profile-edit-title">
                    Edit Profile
                </Typography>

                {error && (
                    <Alert severity="error" className="profile-edit-alert">
                        {error}
                    </Alert>
                )}

                {success && (
                    <Alert severity="success" className="profile-edit-alert">
                        {success}
                    </Alert>
                )}

                <form className="profile-edit-form">
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
                        label="Bio"
                        type="text"
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        fullWidth
                        margin="normal"
                        error={!!bioError}
                        helperText={bioError || "Optional. Maximum 1000 characters."}
                        multiline
                        rows={4}
                        disabled={loading || !!success}
                        id="bio"
                    />

                    <TextField
                        label="Website"
                        type="url"
                        value={website}
                        onChange={(e) => setWebsite(e.target.value)}
                        fullWidth
                        margin="normal"
                        error={!!websiteError}
                        helperText={websiteError || "Optional. Enter a valid URL."}
                        disabled={loading || !!success}
                    />

                    <Box className="profile-edit-actions">
                        <Button
                            variant="outlined"
                            color="secondary"
                            onClick={handleProfile}
                            disabled={loading}
                            className="profile-edit-button"
                        >
                            Cancel
                        </Button>

                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleSubmit}
                            disabled={loading || !!success}
                            className="profile-edit-button"
                        >
                            {loading ? <CircularProgress size={24} /> : "Save Changes"}
                        </Button>
                    </Box>
                </form>
            </Paper>
        </Box>
    );
};

export default ProfileEditView;