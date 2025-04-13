import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { checkAuthStatus, login, logout } from '../api/auth';
import { UserType } from '../types';

interface User {
  id: string;
  name: string;
  role: string;
  email?: string;
  [key: string]: any;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  userType: UserType | null;
  login: (email: string, password: string, userType: string) => Promise<void>;
  logout: () => Promise<void>;
  setUserType: (type: UserType) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userType, setUserType] = useState<UserType | null>(null);

  useEffect(() => {
    // Check if user is already authenticated on app load
    const checkAuth = async () => {
      setIsLoading(true);
      try {
        // Check local storage first
        const storedUser = localStorage.getItem('user');
        const storedType = localStorage.getItem('userType') as UserType;
        
        if (storedUser) {
          setUser(JSON.parse(storedUser));
          if (storedType) {
            setUserType(storedType);
          }
        } else {
          // Fallback to API check (if token exists)
          const token = localStorage.getItem('token');
          if (token) {
            const userData = await checkAuthStatus();
            setUser(userData);
            // Set user type based on role if available
            if (userData.role === 'donor') {
              setUserType('donator');
            } else if (userData.role === 'receiver') {
              setUserType('shelter');
            }
          }
        }
      } catch (error) {
        console.error('Authentication check failed:', error);
        // Clear potentially invalid data
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const handleLogin = async (email: string, password: string, userType: string) => {
    setIsLoading(true);
    try {
      const response = await login(email, password, userType);
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      localStorage.setItem('userType', userType as UserType);
      setUser(response.user);
      setUserType(userType as UserType);
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
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      // Always clear local data regardless of API success
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('userType');
      setUser(null);
      setUserType(null);
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
    setUserType: handleSetUserType,
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