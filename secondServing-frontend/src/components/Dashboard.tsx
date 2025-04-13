import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface User {
  name: string;
  role: string;
  // Add other user properties as needed
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  
  useEffect(() => {
    // Get user info from localStorage
    const userString = localStorage.getItem('user');
    if (userString) {
      try {
        const userData = JSON.parse(userString);
        setUser(userData);
      } catch (error) {
        console.error('Failed to parse user data:', error);
        handleSignOut();
      }
    }
  }, []);

  const handleSignOut = () => {
    // Clear localStorage and redirect to home
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userType');
    navigate('/');
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="max-w-4xl w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Welcome to SecondServing!</h1>
        <p className="text-gray-600 mb-8">
          You have successfully authenticated as a {user.role === 'donor' ? 'donor' : 'shelter'}.
        </p>
        
        {/* Dashboard content will go here */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Your Dashboard</h2>
          <div className="bg-gray-50 p-6 rounded-lg">
            <p className="text-gray-700">Welcome, {user.name}!</p>
            <p className="text-gray-700 mt-2">
              {user.role === 'donor' 
                ? 'Here you can manage your food donations and see the impact you\'re making.' 
                : 'Here you can manage incoming donations and communicate with donors.'}
            </p>
          </div>
        </div>
        
        <button
          onClick={handleSignOut}
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default Dashboard;