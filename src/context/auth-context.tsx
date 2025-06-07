
"use client";

import type { ReactNode } from 'react';
import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User } from '@/types'; // Frontend User type
import type { SignInPayload, SignUpPayload, ApiUser, AuthApiResponse } from '@/types/api'; // Changed from AuthResponse to AuthApiResponse
import { signinUser, signupUser } from '@/services/api';

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (payload: SignInPayload) => Promise<void>;
  logout: () => void;
  signup: (payload: Omit<SignUpPayload, 'role' | 'avatarUrl'>) => Promise<void>; 
  isLoading: boolean;
  authError: string | null;
  clearAuthError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// This adapter is for converting the full ApiUser model to frontend User.
// It might not be directly used if auth endpoints return a simpler structure.
const adaptApiUserToFrontendUser = (apiUser: ApiUser): User => {
  if (!apiUser) {
    console.error("adaptApiUserToFrontendUser received undefined apiUser");
    throw new Error("User data is missing in the response.");
  }
  return {
    id: apiUser.id || apiUser._id, // Use apiUser.id if present, fallback to _id
    name: apiUser.name,
    email: apiUser.email,
    role: apiUser.role,
    avatarUrl: apiUser.avatarUrl,
    lastLogin: apiUser.lastLogin,
  };
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Initial loading for checking localStorage
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    setIsLoading(true);
    setAuthError(null);
    try {
      const storedUser = localStorage.getItem('authUser');
      if (storedUser) {
        const parsedUser: User = JSON.parse(storedUser);
        setUser(parsedUser);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error("Could not access localStorage for auth status:", error);
      localStorage.removeItem('authUser');
      localStorage.removeItem('authToken');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearAuthError = () => setAuthError(null);

  const login = async (payload: SignInPayload) => {
    setIsLoading(true);
    setAuthError(null);
    try {
      const authApiResponse = await signinUser(payload); // Now returns AuthApiResponse
      if (!authApiResponse || !authApiResponse.id || !authApiResponse.token) { // Check for essential fields
        console.error("Sign-in response or essential user data is missing:", authApiResponse);
        const errorMsg = "Sign-in successful, but user data was not returned correctly from the server.";
        setAuthError(errorMsg);
        setIsLoading(false);
        throw new Error(errorMsg);
      }
      
      const frontendUser: User = {
        id: authApiResponse.id,
        name: authApiResponse.name,
        email: authApiResponse.email,
        role: authApiResponse.role,
        avatarUrl: authApiResponse.avatarUrl,
        lastLogin: authApiResponse.lastLogin,
      };

      setUser(frontendUser);
      setIsAuthenticated(true);
      localStorage.setItem('authUser', JSON.stringify(frontendUser));
      localStorage.setItem('authToken', authApiResponse.token);
      // No need to set isLoading to false here if page redirects or modal closes
    } catch (error: any) {
      console.error("Login failed:", error);
      setAuthError(error.message || "Login failed. Please check your credentials.");
      setIsAuthenticated(false);
      setUser(null);
      localStorage.removeItem('authUser');
      localStorage.removeItem('authToken');
      setIsLoading(false); 
      throw error; 
    } finally {
      // Ensure isLoading is false if not handled by success/error specific paths
      // but login often leads to modal close/redirect, so direct setIsLoading(false) might be okay earlier.
      if (isLoading) setIsLoading(false);
    }
  };

  const signup = async (payload: Omit<SignUpPayload, 'role' | 'avatarUrl'>) => {
    setIsLoading(true);
    setAuthError(null);
    const fullPayload: SignUpPayload = {
      ...payload,
      role: 'Viewer', 
      avatarUrl: null, 
    };
    try {
      const authApiResponse = await signupUser(fullPayload); // Now returns AuthApiResponse
      
      if (!authApiResponse || !authApiResponse.id || !authApiResponse.token) { // Check for essential fields
        console.error("Sign-up response or essential user data is missing:", authApiResponse);
        const errorMsg = "Sign-up successful, but user data was not returned correctly from the server.";
        setAuthError(errorMsg);
        setIsLoading(false);
        throw new Error(errorMsg);
      }

      const frontendUser: User = {
        id: authApiResponse.id,
        name: authApiResponse.name,
        email: authApiResponse.email,
        role: authApiResponse.role,
        avatarUrl: authApiResponse.avatarUrl,
        lastLogin: authApiResponse.lastLogin,
      };
      
      setUser(frontendUser);
      setIsAuthenticated(true);
      localStorage.setItem('authUser', JSON.stringify(frontendUser));
      localStorage.setItem('authToken', authApiResponse.token);

    } catch (error: any) {
      console.error("Signup failed:", error);
      setAuthError(error.message || "Signup failed. Please try again.");
      setIsAuthenticated(false);
      setUser(null);
      localStorage.removeItem('authUser');
      localStorage.removeItem('authToken');
      setIsLoading(false);
      throw error; 
    } finally {
       if (isLoading) setIsLoading(false);
    }
  };


  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    setAuthError(null);
    try {
      localStorage.removeItem('authUser');
      localStorage.removeItem('authToken');
    } catch (error) {
      console.error("Could not remove localStorage for auth status:", error);
    }
    // No need to set isLoading for logout unless there's an async logout process
  };

  return (
    <AuthContext.Provider value={{ 
        isAuthenticated, 
        user, 
        login, 
        logout, 
        signup, 
        isLoading: isLoading, // isLoading now reflects API call status too
        authError, 
        clearAuthError 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
