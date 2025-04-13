import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading, checkAuthStatus } = useAuth();
  const [authChecked, setAuthChecked] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Only perform auth check if not already loading or authenticated
    if (!isLoading && !isAuthenticated && !authChecked) {
      const verifyAuth = async () => {
        try {
          await checkAuthStatus();
          setAuthChecked(true);
        } catch (error) {
          console.error('Authentication verification failed:', error);
          setAuthChecked(true);
        }
      };

      verifyAuth();
    } else if (isAuthenticated) {
      // If we're authenticated, mark as checked
      setAuthChecked(true);
    }
  }, [isLoading, isAuthenticated, checkAuthStatus, authChecked]);

  // Show loading until both the auth context loading is complete and our additional check is done
  if (isLoading || (!isAuthenticated && !authChecked)) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-600">Verifying your authentication...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated after all checks
  if (!isAuthenticated) {
    // Store the intended destination to redirect back after login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Render children if authenticated
  return <>{children}</>;
};

export default ProtectedRoute;