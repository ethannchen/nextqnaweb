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
  /** Current logged-in user data from context */
  const currentUser = useUser();
  /** Function to update user context with updated profile data */
  const updateUser = useUserUpdate();

  // Form input states
  /** Username input value */
  const [username, setUsername] = useState("");
  /** Email input value */
  const [email, setEmail] = useState("");
  /** Bio input value (optional) */
  const [bio, setBio] = useState("");
  /** Website input value (optional) */
  const [website, setWebsite] = useState("");

  // Validation error states
  /** Error message for username field */
  const [usernameError, setUsernameError] = useState("");
  /** Error message for email field */
  const [emailError, setEmailError] = useState("");
  /** Error message for bio field */
  const [bioError, setBioError] = useState("");
  /** Error message for website field */
  const [websiteError, setWebsiteError] = useState("");

  // Form status states
  /** Loading state during API call */
  const [loading, setLoading] = useState(false);
  /** General error message */
  const [error, setError] = useState("");
  /** Success message */
  const [success, setSuccess] = useState("");

  /**
   * Effect hook to initialize form fields with current user data when component mounts or user changes.
   * Populates the form fields with the current user's profile information.
   */
  useEffect(() => {
    if (currentUser) {
      setUsername(currentUser.username || "");
      setEmail(currentUser.email || "");
      setBio(currentUser.bio || "");
      setWebsite(currentUser.website || "");
    }
  }, [currentUser]);

  /**
   * Validates all form input fields and sets appropriate error messages.
   * Checks for:
   * - Username: Required, 3-30 characters, alphanumeric + underscores only
   * - Email: Required, valid email format
   * - Bio: Optional, max 1000 characters
   * - Website: Optional, valid URL format
   *
   * @returns {boolean} True if all inputs are valid, false otherwise
   */
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

  /**
   * Handles form submission for profile update.
   * Validates inputs, calls the API, updates user context on success,
   * and navigates to profile page after a brief delay.
   *
   * @async
   * @returns {Promise<void>}
   */
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
