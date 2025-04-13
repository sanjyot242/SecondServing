// src/context/AuthContext.tsx
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { getCurrentUser, login as apiLogin, logout as apiLogout, registerShelter as apiRegisterShelter, registerDonator as apiRegisterDonator } from '../api/auth';
import { UserType, ShelterData, DonatorData } from '../types';

interface User {
  user_id: number;
  email: string;
  role: 'provider' | 'receiver';
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  userType: UserType | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  registerShelter: (data: ShelterData) => Promise<void>;
  registerDonator: (data: DonatorData) => Promise<void>;
  setUserType: (type: UserType) => void;
  checkAuthStatus: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userType, setUserType] = useState<UserType | null>(null);
  // Add this to track if we're in the middle of a logout operation
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Initialize stored user type
  useEffect(() => {
    const storedType = localStorage.getItem('userType') as UserType;
    if (storedType) {
      setUserType(storedType);
    }
  }, []);

  // Initial auth check
  useEffect(() => {
    const checkAuth = async () => {
      // Don't check auth if we're in the process of logging out
      if (isLoggingOut) {
        return;
      }
      
      setIsLoading(true);
      try {
        const userData = await getCurrentUser();
        setUser(userData);
        
        // Set user type based on role
        if (userData.role === 'provider') {
          setUserType('donator');
          localStorage.setItem('userType', 'donator');
        } else if (userData.role === 'receiver') {
          setUserType('shelter');
          localStorage.setItem('userType', 'shelter');
        }
      } catch (error) {
        // Not authenticated, clear user data
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [isLoggingOut]);

  // Reusable function to check authentication status
  const checkAuthStatus = async (): Promise<boolean> => {
    // Don't check auth if we're in the process of logging out
    if (isLoggingOut) {
      return false;
    }
    
    try {
      const userData = await getCurrentUser();
      setUser(userData);
      
      // Set user type based on role
      if (userData.role === 'provider') {
        setUserType('donator');
        localStorage.setItem('userType', 'donator');
      } else if (userData.role === 'receiver') {
        setUserType('shelter');
        localStorage.setItem('userType', 'shelter');
      }
      
      return true;
    } catch (error) {
      // Not authenticated
      setUser(null);
      return false;
    }
  };

  const handleLogin = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      await apiLogin(email, password);
      await checkAuthStatus();
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterShelter = async (data: ShelterData) => {
    setIsLoading(true);
    try {
      await apiRegisterShelter(data);
      await checkAuthStatus();
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterDonator = async (data: DonatorData) => {
    setIsLoading(true);
    try {
      await apiRegisterDonator(data);
      await checkAuthStatus();
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    setIsLoading(true);
    
    try {
      await apiLogout();
      // Clear all authentication state
      setUser(null);
      
      // We can either keep the userType for UX purposes or clear it
      // If you're having issues, let's try clearing it completely
      // setUserType(null);
      // localStorage.removeItem('userType');
      
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setIsLoading(false);
      
      // Add a small delay before allowing new auth checks
      // This prevents race conditions during navigation after logout
      setTimeout(() => {
        setIsLoggingOut(false);
      }, 500);
    }
  };

  const handleSetUserType = (type: UserType) => {
    setUserType(type);
    localStorage.setItem('userType', type);
  };

  const value = {
    user,
    isLoading,
    isAuthenticated: !!user && !isLoggingOut,
    userType,
    login: handleLogin,
    logout: handleLogout,
    registerShelter: handleRegisterShelter,
    registerDonator: handleRegisterDonator,
    setUserType: handleSetUserType,
    checkAuthStatus,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;