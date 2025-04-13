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
      {isAuthenticated && <Navbar />}
      
      <Routes>
        {/* Public Routes - No Authentication Required */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/user-type-selection" element={<UserTypeSelection />} />
        <Route path="/register/shelter" element={<ShelterRegistrationForm />} />
        <Route path="/register/donator" element={<DonatorRegistrationForm />} />
        <Route path="/login" element={<LoginForm />} />
        
        {/* Protected Routes - Authentication Required */}
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

      {isAuthenticated && <Footer />}
    </div>
  );
};

export default App;