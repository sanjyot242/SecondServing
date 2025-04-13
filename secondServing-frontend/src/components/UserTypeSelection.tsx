import React from 'react';
import { UserType } from '../types';
import '../styles/spaceTheme.css';

interface UserTypeSelectionProps {
  onSelectUserType: (userType: UserType) => void;
}

const UserTypeSelection: React.FC<UserTypeSelectionProps> = ({ onSelectUserType }) => {
  return (
    <div className='space-container'>
      <div className="min-h-screen bg-cover bg-center bg-no-repeat flex flex-col items-center justify-center p-4" >
        <div className="max-w-md w-full backdrop-blur-md bg-white/30 rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 space-header">Welcome to SecondServing</h1>
            <p className="text-gray-600 mt-2">
              Connect surplus food with those who need it most
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-center mb-4">I am a:</h2>

            <button
              onClick={() => onSelectUserType('shelter')}
              className="w-full flex items-center justify-center py-3 px-4 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-lg transition duration-150 cursor-pointer"
            >
              Local Shelter
            </button>

            <button
              onClick={() => onSelectUserType('donator')}
              className="w-full flex items-center justify-center py-3 px-4  bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-lg transition duration-150 cursor-pointer"
            >
              Food Donor
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserTypeSelection;
