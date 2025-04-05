import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService } from '../services/authService';

// User interface
export interface User {
    _id: string;
    username: string;
    email: string;
    role: 'user' | 'admin';
    bio?: string;
    website?: string;
    createdAt: string;
}

// Authentication state interface
interface AuthState {
    isAuthenticated: boolean;
    user: User | null;
    loading: boolean;
    error: string | null;
}

// Authentication context interface
interface AuthContextProps {
    authState: AuthState;
    login: (email: string, password: string) => Promise<void>;
    signup: (username: string, email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    updateProfile: (profileData: Partial<User>) => Promise<void>;
    clearError: () => void;
}

// Create Auth Context
const AuthContext = createContext<AuthContextProps | undefined>(undefined);

// Auth Provider Props
interface AuthProviderProps {
    children: ReactNode;
}

// Auth Provider Component
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [authState, setAuthState] = useState<AuthState>({
        isAuthenticated: false,
        user: null,
        loading: true,
        error: null,
    });

    // Check if user is already logged in when app loads
    useEffect(() => {
        const checkAuthStatus = async () => {
            try {
                const user = await authService.getProfile();
                setAuthState({
                    isAuthenticated: true,
                    user,
                    loading: false,
                    error: null,
                });
            } catch (error) {
                setAuthState({
                    isAuthenticated: false,
                    user: null,
                    loading: false,
                    error: null,
                });
            }
        };

        checkAuthStatus();
    }, []);

    // Login function
    const login = async (email: string, password: string) => {
        try {
            setAuthState(prev => ({ ...prev, loading: true, error: null }));
            const data = await authService.login(email, password);

            setAuthState({
                isAuthenticated: true,
                user: data.user,
                loading: false,
                error: null,
            });
        } catch (error: any) {
            setAuthState(prev => ({
                ...prev,
                loading: false,
                error: error.response?.data?.message || 'Login failed',
            }));
        }
    };

    // Signup function
    const signup = async (username: string, email: string, password: string) => {
        try {
            setAuthState(prev => ({ ...prev, loading: true, error: null }));
            const data = await authService.register(username, email, password);

            setAuthState({
                isAuthenticated: true,
                user: data.user,
                loading: false,
                error: null,
            });
        } catch (error: any) {
            setAuthState(prev => ({
                ...prev,
                loading: false,
                error: error.response?.data?.message || 'Signup failed',
            }));
        }
    };

    // Logout function
    const logout = async () => {
        try {
            await authService.logout();
            setAuthState({
                isAuthenticated: false,
                user: null,
                loading: false,
                error: null,
            });
        } catch (error: any) {
            setAuthState(prev => ({
                ...prev,
                error: error.response?.data?.message || 'Logout failed',
            }));
        }
    };

    // Update profile function
    const updateProfile = async (profileData: Partial<User>) => {
        try {
            setAuthState(prev => ({ ...prev, loading: true, error: null }));
            const updatedUser = await authService.updateProfile(profileData);

            setAuthState(prev => ({
                ...prev,
                user: updatedUser,
                loading: false,
                error: null,
            }));
        } catch (error: any) {
            setAuthState(prev => ({
                ...prev,
                loading: false,
                error: error.response?.data?.message || 'Profile update failed',
            }));
        }
    };

    // Clear error function
    const clearError = () => {
        setAuthState(prev => ({ ...prev, error: null }));
    };

    return (
        <AuthContext.Provider
            value={{
                authState,
                login,
                signup,
                logout,
                updateProfile,
                clearError,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook to use Auth Context
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};