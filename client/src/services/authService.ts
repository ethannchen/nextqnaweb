/**
 * This module defines the functions to interact with the authentication API.
 */

import { REACT_APP_API_URL, api } from "./config";

/**
 * The base URL for the auth API
 */
const AUTH_API_URL = `${REACT_APP_API_URL}/auth`;

/**
 * Interface representing the response from a successful login request
 *
 * @interface LoginResponse
 * @property {string} token - JWT authentication token
 * @property {Object} user - User information
 * @property {string} user.id - Unique identifier for the user
 * @property {string} user.username - User's chosen username
 * @property {string} user.email - User's email address
 * @property {string} user.role - User's role/access level
 * @property {string} [user.bio] - User's optional biography
 * @property {string} [user.website] - User's optional website URL
 */
interface LoginResponse {
  token: string;
  user: {
    id: string;
    username: string;
    email: string;
    role: string;
    bio?: string;
    website?: string;
  };
}

/**
 * Interface representing the required credentials for user registration
 *
 * @interface SignupCredentials
 * @property {string} username - Desired username
 * @property {string} email - User's email address
 * @property {string} password - User's chosen password
 * @property {string} [role] - Optional user role (defaults to regular user if not specified)
 */
interface SignupCredentials {
  username: string;
  email: string;
  password: string;
  role?: string;
}

/**
 * Interface representing the required credentials for user login
 *
 * @interface LoginCredentials
 * @property {string} email - User's email address
 * @property {string} password - User's password
 */
interface LoginCredentials {
  email: string;
  password: string;
}

/**
 * Sign up a new user
 * @param credentials User's signup information
 * @returns Response message
 */
export const signup = async (
  credentials: SignupCredentials
): Promise<{ message: string }> => {
  try {
    const res = await api.post(`${AUTH_API_URL}/signup`, credentials);
    if (res.status !== 201) {
      throw new Error("Error signing up");
    }
    return res.data;
  } catch (error) {
    console.error("Error signing up:", error);
    throw error;
  }
};

/**
 * Log in a user
 * @param credentials User's login credentials
 * @returns User token and information
 */
export const login = async (
  credentials: LoginCredentials
): Promise<LoginResponse> => {
  try {
    const res = await api.post(`${AUTH_API_URL}/login`, credentials);
    if (res.status !== 200) {
      throw new Error("Error logging in");
    }

    // Store the token in localStorage
    localStorage.setItem("token", res.data.token);

    // Set the token in the default Authorization header for future requests
    api.defaults.headers.common["Authorization"] = `Bearer ${res.data.token}`;

    return res.data;
  } catch (error) {
    console.error("Error logging in:", error);
    throw error;
  }
};

/**
 * Log out the current user
 */
export const logout = (): void => {
  // Remove token from localStorage
  localStorage.removeItem("token");

  // Remove token from default headers
  delete api.defaults.headers.common["Authorization"];
};

/**
 * Initialize authentication state from localStorage (to be called on app start)
 */
export const initAuth = (): void => {
  const token = localStorage.getItem("token");
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }
};
