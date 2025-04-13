import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import UserTypeSelection from './components/UserTypeSelection';
import ShelterRegistrationForm from './components/ShelterRegistrationForm';
import DonatorRegistrationForm from './components/DonatorRegistrationForm';
import LoginForm from './components/LoginForm';
import Dashboard from './components/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      {/* Navbar and Footer only show when user is authenticated and on the dashboard */}
      {isAuthenticated && <Navbar />}
      
      <Routes>
        {/* Landing page route */}
        <Route 
          path="/" 
          element={<LandingPage />}  // Show landing page first
        />

        {/* After "Join Us" click, navigate to UserTypeSelection */}
        <Route 
          path="/user-type-selection" 
          element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <UserTypeSelection />} 
        />
        
        {/* Public routes */}
        <Route 
          path="/register/shelter" 
          element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <ShelterRegistrationForm />} 
        />
        <Route 
          path="/register/donator" 
          element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <DonatorRegistrationForm />} 
        />
        <Route 
          path="/login" 
          element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginForm />} 
        />
        
        {/* Protected route for the Dashboard */}
        <Route 
          path="/dashboard/*" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        
        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {/* Footer only shows on dashboard and when authenticated */}
      {isAuthenticated && <Footer />}
    </div>
  );
};

export default App;
