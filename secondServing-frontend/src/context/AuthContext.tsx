import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { getCurrentUser, login, logout, registerShelter, registerDonator } from '../api/auth';
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
      setIsLoading(true);
      try {
        const userData = await getCurrentUser();
        setUser(userData);
        
        // Set user type based on role
        if (userData.role === 'provider') {
          setUserType('donator');
        } else if (userData.role === 'receiver') {
          setUserType('shelter');
        }
      } catch (error) {
        // Not authenticated, clear user data
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Reusable function to check authentication status
  const checkAuthStatus = async (): Promise<boolean> => {
    try {
      const userData = await getCurrentUser();
      setUser(userData);
      
      // Set user type based on role
      if (userData.role === 'provider') {
        setUserType('donator');
      } else if (userData.role === 'receiver') {
        setUserType('shelter');
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
      await login(email, password);
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
      await registerShelter(data);
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
      await registerDonator(data);
      await checkAuthStatus();
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await logout();
      setUser(null);
      // We keep the userType for UX purposes
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSetUserType = (type: UserType) => {
    setUserType(type);
    localStorage.setItem('userType', type);
  };

  const value = {
    user,
    isLoading,
    isAuthenticated: !!user,
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