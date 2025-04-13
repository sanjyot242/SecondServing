import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from 'react-router-dom';
import UserTypeSelection from './components/UserTypeSelection';
import ShelterRegistrationForm from './components/ShelterRegistrationForm';
import DonatorRegistrationForm from './components/DonatorRegistrationForm';
import LoginForm from './components/LoginForm';
import DashboardRouter from './components/DashboardRouter'; // Import the new DashboardRouter
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider, useAuth } from './context/AuthContext';
import LandingPage from './components/LandingPage';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
};

const AppContent: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // Check if the user is authenticated for specific routes like /dashboard
  if (isLoading) {
    return (
      <div className='min-h-screen bg-gray-100 flex items-center justify-center'>
        <div className='text-center'>
          <p className='text-xl text-gray-600'>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className='app'>
      <Routes>
        {/* Landing page route */}
        <Route
          path='/'
          element={
            isAuthenticated ? (
              <Navigate to='/dashboard' replace />
            ) : (
              <LandingPage />
            )
          }
        />

        {/* After "Join Us" click, navigate to UserTypeSelection */}
        <Route
          path='/user-type-selection'
          element={
            isAuthenticated ? (
              <Navigate to='/dashboard' replace />
            ) : (
              <UserTypeSelection />
            )
          }
        />

        {/* Public routes */}
        <Route
          path='/register/shelter'
          element={
            isAuthenticated ? (
              <Navigate to='/dashboard' replace />
            ) : (
              <ShelterRegistrationForm />
            )
          }
        />
        <Route
          path='/register/donator'
          element={
            isAuthenticated ? (
              <Navigate to='/dashboard' replace />
            ) : (
              <DonatorRegistrationForm />
            )
          }
        />
        <Route
          path='/login'
          element={
            isAuthenticated ? (
              <Navigate to='/dashboard' replace />
            ) : (
              <LoginForm />
            )
          }
        />

        {/* Protected route for the Dashboard - using the new DashboardRouter */}
        <Route
          path='/dashboard/*'
          element={
            <ProtectedRoute>
              <DashboardRouter />
            </ProtectedRoute>
          }
        />

        {/* Fallback route */}
        <Route path='*' element={<Navigate to='/' replace />} />
      </Routes>
    </div>
  );
};

export default App;
