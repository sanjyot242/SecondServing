import React from 'react';
import { useNavigate } from 'react-router-dom';
import { UserType } from '../types';
import { motion } from 'framer-motion';
import '../styles/spaceTheme.css';

const UserTypeSelection: React.FC = () => {
  const navigate = useNavigate();

  const handleSelectUserType = (userType: UserType) => {
    // Set the user type in localStorage to persist it
    localStorage.setItem('userType', userType);
    
    // Navigate to the registration page for the selected user type
    navigate(`/register/${userType}`);
  };

  return (
    <motion.div
      className='space-container'
      initial={{ x: '100%' }}   // Start off-screen to the right
      animate={{ x: 0 }}        // End at default position (0, center)
      exit={{ x: '-100%' }}      // Move to the left (off-screen) when navigating away
      transition={{ 
        type: 'spring', 
        stiffness: 100, 
        damping: 25, 
        duration: 1
      }} 
    >
      <div className="min-h-screen bg-cover bg-center bg-no-repeat flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full backdrop-blur-md bg-white/30 rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 space-header">Welcome to SecondServing</h1>
            <p className="text-gray-600 mt-2 space-subheader">
              Connect surplus food with those who need it most
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-center mb-4 space-text">I am a:</h2>

            <button
              onClick={() => handleSelectUserType('shelter')}
              className="w-full flex items-center justify-center py-3 px-4 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-lg transition duration-150 cursor-pointer glow-effect space-button-ghost"
            >
              Local Shelter
            </button>

            <button
              onClick={() => handleSelectUserType('donator')}
              className="w-full flex items-center justify-center py-3 px-4 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-lg transition duration-150 cursor-pointer glow-effect space-button-ghost"
            >
              Food Donor
            </button>
            
            <div className="text-center pt-4">
              <button 
                onClick={() => navigate('/login')}
                className="text-gray-800 hover:text-gray-600 text-sm underline"
              >
                Already have an account? Sign in
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default UserTypeSelection;
