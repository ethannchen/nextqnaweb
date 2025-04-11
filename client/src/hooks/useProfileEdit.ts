import { useState, useEffect } from "react";
import { useUser, useUserUpdate } from "../contexts/UserContext";
import { updateProfile } from "../services/userService";
import { VoidFunctionType } from "../types/functionTypes";

/**
 * Custom hook for the profile edit functionality
 * @param handleProfile Navigation function to return to profile on success
 * @returns Profile edit state and handlers
 */
export const useProfileEdit = (handleProfile: VoidFunctionType) => {
  const currentUser = useUser();
  const updateUser = useUserUpdate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [website, setWebsite] = useState("");

  const [usernameError, setUsernameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [bioError, setBioError] = useState("");
  const [websiteError, setWebsiteError] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Initialize form with current user data
  useEffect(() => {
    if (currentUser) {
      setUsername(currentUser.username || "");
      setEmail(currentUser.email || "");
      setBio(currentUser.bio || "");
      setWebsite(currentUser.website || "");
    }
  }, [currentUser]);

  const validateInputs = (): boolean => {
    let isValid = true;

    // Reset previous errors
    setUsernameError("");
    setEmailError("");
    setBioError("");
    setWebsiteError("");
    setError("");

    // Validate username
    if (!username.trim()) {
      setUsernameError("Username is required");
      isValid = false;
    } else if (username.length < 3 || username.length > 30) {
      setUsernameError("Username must be between 3 and 30 characters");
      isValid = false;
    } else if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      setUsernameError(
        "Username can only contain letters, numbers, and underscores"
      );
      isValid = false;
    }

    // Validate email
    if (!email.trim()) {
      setEmailError("Email is required");
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError("Please enter a valid email address");
      isValid = false;
    }

    // Validate bio (optional)
    if (bio && bio.length > 1000) {
      setBioError("Bio cannot exceed 1000 characters");
      isValid = false;
    }

    // Validate website (optional)
    if (website && website.trim() !== "") {
      try {
        new URL(website);
      } catch (e) {
        setWebsiteError("Please enter a valid URL");
        isValid = false;
      }
    }

    return isValid;
  };

  const handleSubmit = async () => {
    if (!validateInputs()) return;

    setLoading(true);

    try {
      const updatedUser = await updateProfile({
        username,
        email,
        bio: bio || undefined,
        website: website || null,
      });

      // Update the user context with the updated user info
      if (currentUser) {
        updateUser({
          ...currentUser,
          username: updatedUser.username,
          email: updatedUser.email,
          bio: updatedUser.bio,
          website: updatedUser.website,
        });
      }

      setSuccess("Profile updated successfully!");

      // Return to profile page after a brief delay
      setTimeout(() => {
        handleProfile();
      }, 1500);
    } catch (err: any) {
      setError(
        err.response?.data?.error ||
          "Failed to update profile. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return {
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
    handleSubmit,
  };
};
