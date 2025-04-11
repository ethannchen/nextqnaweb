/**
 * This module defines the functions to interact with the user API.
 */

import { REACT_APP_API_URL, api } from "./config";

// The base URL for the user API
const USER_API_URL = `${REACT_APP_API_URL}/user`;

interface UserProfile {
  id: string;
  username: string;
  email: string;
  role: string;
  bio?: string;
  website?: string;
}

interface ProfileUpdateData {
  username?: string;
  email?: string;
  bio?: string;
  website?: string | null;
}

interface PasswordChangeData {
  currentPassword: string;
  newPassword: string;
}

/**
 * Update a user's profile
 * @param profileData The data to update
 * @returns Updated user profile
 */
export const updateProfile = async (
  profileData: ProfileUpdateData
): Promise<UserProfile> => {
  try {
    const res = await api.put(`${USER_API_URL}/profile`, profileData);
    if (res.status !== 200) {
      throw new Error("Error updating profile");
    }
    return res.data.user;
  } catch (error) {
    console.error("Error updating profile:", error);
    throw error;
  }
};

/**
 * Change a user's password
 * @param passwordData Current and new password
 * @returns Success message
 */
export const changePassword = async (
  passwordData: PasswordChangeData
): Promise<{ message: string }> => {
  try {
    const res = await api.put(`${USER_API_URL}/changePassword`, passwordData);
    if (res.status !== 200) {
      throw new Error("Error changing password");
    }
    return res.data;
  } catch (error) {
    console.error("Error changing password:", error);
    throw error;
  }
};

/**
 * Delete a user's account
 * @returns Success message
 */
export const deleteAccount = async (): Promise<{ message: string }> => {
  try {
    const res = await api.delete(`${USER_API_URL}/account`);
    if (res.status !== 200) {
      throw new Error("Error deleting account");
    }
    return res.data;
  } catch (error) {
    console.error("Error deleting account:", error);
    throw error;
  }
};
