import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getCurrentUser } from '../api/auth';

interface UserData {
  user_id: number;
  email: string;
  role: 'provider' | 'receiver';
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { setUserType, logout, isAuthenticated } = useAuth();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // This will automatically send the access_token cookie
        const data = await getCurrentUser();
        setUserData(data);
        
        // Update auth context
        if (data.role === 'provider') {
          setUserType('donator');
        } else if (data.role === 'receiver') {
          setUserType('shelter');
        }
      } catch (error) {
        console.error('Authentication failed:', error);
        navigate('/login');
      } finally {
        setIsLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchUserData();
    } else {
      setIsLoading(false);
    }
  }, [navigate, setUserType, isAuthenticated]);
  
  const handleSignOut = async () => {
    try {
      // Perform the logout operation
      await logout();
      
      // Add a small delay before navigation to ensure logout is processed
      setTimeout(() => {
        navigate('/', { replace: true });
      }, 100);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-600">Authentication error. Please log in again.</p>
          <button 
            onClick={() => navigate('/login')}
            className="mt-4 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="max-w-4xl w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Welcome to SecondServing!</h1>
        <p className="text-gray-600 mb-8">
          You are logged in as a {userData.role === 'provider' ? 'food donor' : 'shelter'}.
        </p>
        
        {/* Dashboard content will go here */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Your Dashboard</h2>
          <div className="bg-gray-50 p-6 rounded-lg">
            <p className="text-gray-700">Welcome, {userData.email}!</p>
            <p className="text-gray-700 mt-2">
              {userData.role === 'provider' 
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