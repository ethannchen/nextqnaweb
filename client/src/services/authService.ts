import { api, REACT_APP_API_URL } from "./config";
import { User } from "../context/AuthContext";

/**
 * Authentication service to handle all auth-related API calls
 */
const authService = {
  /**
   * Register a new user
   * @param username - User's username
   * @param email - User's email
   * @param password - User's password
   * @returns Promise with user data
   */
  register: async (
    username: string,
    email: string,
    password: string
  ): Promise<{ user: User; token: string }> => {
    const response = await api.post(`${REACT_APP_API_URL}/api/auth/register`, {
      username,
      email,
      password,
    });
    return response.data;
  },

  /**
   * Login a user
   * @param email - User's email
   * @param password - User's password
   * @returns Promise with user data
   */
  login: async (
    email: string,
    password: string
  ): Promise<{ user: User; token: string }> => {
    const response = await api.post(`${REACT_APP_API_URL}/api/auth/login`, {
      email,
      password,
    });
    return response.data;
  },

  /**
   * Logout the current user
   */
  logout: async (): Promise<void> => {
    await api.post(`${REACT_APP_API_URL}/api/auth/logout`);
  },

  /**
   * Get the current user's profile
   * @returns Promise with user data
   */
  getProfile: async (): Promise<User> => {
    const response = await api.get(`${REACT_APP_API_URL}/api/auth/me`);
    return response.data;
  },

  /**
   * Update user profile
   * @param profileData - User profile data to update
   * @returns Promise with updated user data
   */
  updateProfile: async (profileData: Partial<User>): Promise<User> => {
    const response = await api.put(
      `${REACT_APP_API_URL}/api/users/profile`,
      profileData
    );
    return response.data;
  },

  /**
   * Change user password
   * @param currentPassword - Current password
   * @param newPassword - New password
   * @returns Promise with success message
   */
  changePassword: async (
    currentPassword: string,
    newPassword: string
  ): Promise<{ message: string }> => {
    const response = await api.put(`${REACT_APP_API_URL}/api/users/password`, {
      currentPassword,
      newPassword,
    });
    return response.data;
  },

  /**
   * Request password reset
   * @param email - User's email
   * @returns Promise with success message
   */
  requestPasswordReset: async (email: string): Promise<{ message: string }> => {
    const response = await api.post(
      `${REACT_APP_API_URL}/api/auth/reset-password-request`,
      { email }
    );
    return response.data;
  },

  /**
   * Reset password using token
   * @param token - Reset token
   * @param newPassword - New password
   * @returns Promise with success message
   */
  resetPassword: async (
    token: string,
    newPassword: string
  ): Promise<{ message: string }> => {
    const response = await api.post(
      `${REACT_APP_API_URL}/api/auth/reset-password`,
      {
        token,
        newPassword,
      }
    );
    return response.data;
  },
};

export { authService };
