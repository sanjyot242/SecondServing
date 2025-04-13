import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getCurrentUser } from '../api/auth';
import SideNavigation from './SideNavigation';
import UserWelcomeCard from './UserWelcomeCard';
import InventoryTable from './InventoryTable';
import StatusCard from './StatusCard';
import ActionButton from './ActionButton';

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

  const inventoryItems = [
    {
      name: 'Bread',
      type: 'Baked Goods',
      condition: 'Critical' as const,
      tags: ['No Nuts'],
    },
    {
      name: 'Apples',
      type: 'Produce',
      condition: 'Good' as const,
      tags: ['No Nuts', 'Gluten Free'],
    },
    {
      name: 'Canned Soup',
      type: 'Canned Goods',
      condition: 'Good' as const,
      tags: ['No Nuts', 'Vegan'],
    },
    // ...more items
  ];

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
      <div className='min-h-screen bg-gray-100 flex items-center justify-center'>
        <div className='text-center'>
          <p className='text-xl text-gray-600'>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className='min-h-screen bg-gray-100 flex items-center justify-center'>
        <div className='text-center'>
          <p className='text-xl text-gray-600'>
            Authentication error. Please log in again.
          </p>
          <button
            onClick={() => navigate('/login')}
            className='mt-4 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition'>
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className='flex min-h-screen bg-cosmos-void'>
      <SideNavigation userType='shelter' />

      <div className='flex-1 p-6'>
        <div className='max-w-7xl mx-auto'>
          <UserWelcomeCard name='John' userType='shelter' />

          <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-8'>
            <StatusCard
              title='Upcoming Deliveries'
              count={3}
              userType='shelter'
              icon='calendar'
            />

            <ActionButton
              label='Add Stock'
              icon='plus'
              onClick={() => console.log('Add stock clicked')}
              userType='shelter'
            />

            <ActionButton
              label='NeedMap'
              icon='map'
              onClick={() => console.log('NeedMap clicked')}
              userType='shelter'
            />
          </div>

          <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
            <div className='lg:col-span-2'>
              <InventoryTable items={inventoryItems} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
