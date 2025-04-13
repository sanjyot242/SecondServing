import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import UserWelcomeCard from './UserWelcomeCard';
import StatusCard from './StatusCard';
import ActionButton from './ActionButton';
import InventoryTable from './InventoryTable';
import axios from 'axios';

const DonorDashboard: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const API_URL = 'http://localhost:8080';
  const { user } = useAuth();
  const userName = user?.email?.split('@')[0] || 'User';
  const [inventory, setInventory] = useState([]);

  useEffect(() => {
    const triggerMatchingAndLoadInventory = async () => {
      try {
        // 1. Run the matching logic
        await axios.post(`${API_URL}/match`, {}, { withCredentials: true });

        // 2. Load the inventory after matching
        const response = await axios.get(`${API_URL}/inventory/active`, {
          withCredentials: true,
        });

        setInventory(response.data.inventory);
      } catch (error) {
        console.error("Error in matching or fetching inventory", error);
      }
    };

    triggerMatchingAndLoadInventory();
  }, [location.pathname]);

  return (
    <>
      <UserWelcomeCard name={userName} userType='donator' />

      <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-8'>
        <StatusCard
          title='Upcoming Deliveries'
          count={3}
          userType='donator'
          icon='calendar'
        />

        <ActionButton
          label='Add Stock'
          icon='plus'
          onClick={() => navigate('/dashboard/add-stock')}
          userType='donator'
        />

        <ActionButton
          label='NeedMap'
          icon='map'
          onClick={() => console.log('NeedMap clicked')}
          userType='donator'
        />
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        <div className='lg:col-span-2'>
          <InventoryTable items={inventory} />
        </div>
      </div>
    </>
  );
};

export default DonorDashboard;