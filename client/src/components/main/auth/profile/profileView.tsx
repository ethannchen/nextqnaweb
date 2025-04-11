import React from "react";
import { useProfile } from "../../../../hooks/useProfile";
import { ProfileViewProps } from "../../../../types/pageTypes";
import {
    Box,
    Typography,
    Paper,
    Button,
    Divider,
    CircularProgress,
    Alert,
    List,
    ListItem,
    ListItemText
} from "@mui/material";
import "./profileView.css";

/**
 * Profile component that displays user information and profile management options
 * @param props Functions for navigation to profile-related pages
 * @returns Profile view component
 */
const ProfileView: React.FC<ProfileViewProps> = ({
    handleEditProfile,
    handleChangePassword,
    handleDeleteAccount
}) => {
    const { user, loading, error } = useProfile();

    if (loading) {
        return (
            <Box className="profile-loading">
                <CircularProgress />
            </Box>
        );
    }

    if (error || !user) {
        return (
            <Box className="profile-error">
                <Alert severity="error">
                    {error || "User not authenticated. Please log in."}
                </Alert>
            </Box>
        );
    }

    return (
        <Box className="profile-container">
            <Paper elevation={3} className="profile-paper">
                <Typography variant="h4" className="profile-title">
                    User Profile
                </Typography>

                <List className="profile-info-list">
                    <ListItem>
                        <ListItemText
                            primary="Username"
                            secondary={user.username}
                            primaryTypographyProps={{ variant: "subtitle1", fontWeight: "bold" }}
                        />
                    </ListItem>

                    <ListItem>
                        <ListItemText
                            primary="Email"
                            secondary={user.email}
                            primaryTypographyProps={{ variant: "subtitle1", fontWeight: "bold" }}
                        />
                    </ListItem>

                    <ListItem>
                        <ListItemText
                            primary="Bio"
                            secondary={user.bio || "No bio provided"}
                            primaryTypographyProps={{ variant: "subtitle1", fontWeight: "bold" }}
                        />
                    </ListItem>

                    <ListItem>
                        <ListItemText
                            primary="Website"
                            secondary={user.website || "No website provided"}
                            primaryTypographyProps={{ variant: "subtitle1", fontWeight: "bold" }}
                        />
                    </ListItem>
                </List>

                <Divider className="profile-divider" />

                <Box className="profile-actions">
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleEditProfile}
                        className="profile-button"
                    >
                        Edit Profile
                    </Button>

                    <Button
                        variant="outlined"
                        color="primary"
                        onClick={handleChangePassword}
                        className="profile-button"
                    >
                        Change Password
                    </Button>

                    <Button
                        variant="outlined"
                        color="error"
                        onClick={handleDeleteAccount}
                        className="profile-button"
                    >
                        Delete Account
                    </Button>
                </Box>
            </Paper>
        </Box>
    );
};

export default ProfileView;