/**
 * This module defines the functions to interact with the authentication API.
 */

import { REACT_APP_API_URL, api } from "./config";

// The base URL for the auth API
const AUTH_API_URL = `${REACT_APP_API_URL}/auth`;

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

interface SignupCredentials {
  username: string;
  email: string;
  password: string;
  role?: string;
}

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
