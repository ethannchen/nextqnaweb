import React, { createContext, useContext, useState, ReactNode } from "react";

/**
 * enum for user role
 */
export enum Role {
  Admin = "admin",
  User = "user",
}

/**
 * interface for current user
 */
interface User {
  username: string;
  email: string;
  role: Role;
  bio?: string;
  website?: string;
  createdAt: Date;
}

/**
 * Read only context, used to read the current user
 */
const UserContext = createContext<User | null>(null);

/**
 * update context, used to update the current user
 */
const UserUpdateContext = createContext<
  ((user: User | null) => void) | undefined
>(undefined);

/**
 * UserProvider component that manages the global user state.
 * Creates two separate contexts: one for reading user data and one for updating it.
 * This separation ensures that only specific components can update the user state.
 *
 * @param {Object} props - Component props
 * @param {ReactNode} props.children - Child components that will have access to the user contexts
 * @returns {JSX.Element} Provider component that wraps children with both contexts
 */
export const UserProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  return (
    <UserUpdateContext.Provider value={setCurrentUser}>
      <UserContext.Provider value={currentUser}>
        {children}
      </UserContext.Provider>
    </UserUpdateContext.Provider>
  );
};

/**
 * Hook for accessing the current user data from any component.
 * This hook provides read-only access to the user state.
 *
 * @returns {User | null} The current user object or null if no user is logged in
 */
export const useUser = () => {
  const context = useContext(UserContext);
  return context;
};

/**
 * Hook for updating the current user data.
 * This hook should only be imported in components that are authorized to modify the user state,
 * such as authentication-related components.
 *
 * @throws {Error} If used outside of a UserProvider
 * @returns the current user context
 */
export const useUserUpdate = () => {
  const context = useContext(UserUpdateContext);
  if (context === undefined) {
    throw new Error("useUserUpdate must be used within a UserProvider");
  }
  return context;
};
