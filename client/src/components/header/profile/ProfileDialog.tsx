import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Box,
    Typography,
    Alert,
    CircularProgress,
    Divider,
    Avatar
} from '@mui/material';
import { useAuth } from '../../../context/AuthContext';

interface ProfileDialogProps {
    open: boolean;
    handleClose: () => void;
}

const ProfileDialog: React.FC<ProfileDialogProps> = ({ open, handleClose }) => {
    // Get auth context
    const { authState, updateProfile, clearError } = useAuth();
    const { user, loading, error } = authState;

    // State for form fields
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [bio, setBio] = useState('');
    const [website, setWebsite] = useState('');

    // Form validation errors
    const [bioError, setBioError] = useState('');
    const [websiteError, setWebsiteError] = useState('');

    // Success message
    const [success, setSuccess] = useState(false);

    // Reset form when dialog is opened or closed or user changes
    useEffect(() => {
        if (open && user) {
            setUsername(user.username || '');
            setEmail(user.email || '');
            setBio(user.bio || '');
            setWebsite(user.website || '');
            setBioError('');
            setWebsiteError('');
            setSuccess(false);
            clearError();
        }
    }, [open, user, clearError]);

    // Validate form fields
    const validateForm = (): boolean => {
        let isValid = true;

        // Reset all errors
        setBioError('');
        setWebsiteError('');

        // Validate bio length
        if (bio && bio.length > 500) {
            setBioError('Bio must be less than 500 characters');
            isValid = false;
        }

        // Validate website format if provided
        if (website) {
            try {
                new URL(website);
            } catch (e) {
                setWebsiteError('Please enter a valid URL');
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
            await updateProfile({
                bio,
                website
            });

            setSuccess(true);

            // Auto close after success
            setTimeout(() => {
                if (!error) {
                    handleClose();
                }
            }, 1500);
        } catch (error) {
            // Error is handled in the auth context
        }
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth="sm"
            fullWidth
        >
            <DialogTitle>Profile Settings</DialogTitle>

            <DialogContent>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
                    {error && (
                        <Alert severity="error" sx={{ mb: 1 }}>
                            {error}
                        </Alert>
                    )}

                    {success && (
                        <Alert severity="success" sx={{ mb: 1 }}>
                            Profile updated successfully!
                        </Alert>
                    )}

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                        <Avatar
                            sx={{ width: 80, height: 80, bgcolor: '#f48024', fontSize: '2rem' }}
                        >
                            {username?.charAt(0).toUpperCase()}
                        </Avatar>

                        <Box>
                            <Typography variant="h6">{username}</Typography>
                            <Typography variant="body2" color="textSecondary">
                                {email}
                            </Typography>
                            <Typography variant="caption" color="textSecondary">
                                Member since {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : ''}
                            </Typography>
                        </Box>
                    </Box>

                    <Divider sx={{ my: 1 }} />

                    <Typography variant="subtitle1" fontWeight="bold">
                        Account Information
                    </Typography>

                    <TextField
                        label="Username"
                        value={username}
                        disabled
                        fullWidth
                        variant="outlined"
                        size="small"
                        InputProps={{
                            readOnly: true,
                        }}
                        helperText="Username cannot be changed"
                    />

                    <TextField
                        label="Email"
                        value={email}
                        disabled
                        fullWidth
                        variant="outlined"
                        size="small"
                        InputProps={{
                            readOnly: true,
                        }}
                        helperText="Email cannot be changed"
                    />

                    <Divider sx={{ my: 1 }} />

                    <Typography variant="subtitle1" fontWeight="bold">
                        Profile Information
                    </Typography>

                    <TextField
                        label="Bio"
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        fullWidth
                        multiline
                        rows={4}
                        variant="outlined"
                        size="small"
                        placeholder="Tell us about yourself..."
                        error={!!bioError}
                        helperText={bioError || 'Briefly describe yourself (optional)'}
                    />

                    <TextField
                        label="Website"
                        value={website}
                        onChange={(e) => setWebsite(e.target.value)}
                        fullWidth
                        variant="outlined"
                        size="small"
                        placeholder="https://your-website.com"
                        error={!!websiteError}
                        helperText={websiteError || 'Your personal or professional website (optional)'}
                    />
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
                    disabled={loading}
                >
                    {loading ? (
                        <CircularProgress size={24} color="inherit" />
                    ) : (
                        'Save Changes'
                    )}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ProfileDialog;