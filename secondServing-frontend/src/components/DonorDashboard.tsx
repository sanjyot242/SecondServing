import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import UserWelcomeCard from './UserWelcomeCard';
import StatusCard from './StatusCard';
import ActionButton from './ActionButton';
import InventoryTable from './InventoryTable';
import axios from 'axios';

// Sample inventory data
const SAMPLE_INVENTORY = [
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
  {
    name: 'Rice',
    type: 'Grains',
    condition: 'Good' as const,
    tags: ['Gluten Free', 'Vegan'],
  },
  {
    name: 'Milk',
    type: 'Dairy',
    condition: 'Critical' as const,
    tags: ['No Nuts'],
  },
  {
    name: 'Pasta',
    type: 'Dry Goods',
    condition: 'Good' as const,
    tags: ['Vegetarian'],
  },
  {
    name: 'Bananas',
    type: 'Produce',
    condition: 'Waste' as const,
    tags: ['Gluten Free', 'Vegan'],
  },
  {
    name: 'Yogurt',
    type: 'Dairy',
    condition: 'Critical' as const,
    tags: ['Vegetarian', 'Probiotic'],
  },
  {
    name: 'Canned Beans',
    type: 'Canned Goods',
    condition: 'Good' as const,
    tags: ['Vegan', 'Kosher'],
  },
  {
    name: 'Cereal',
    type: 'Dry Goods',
    condition: 'Good' as const,
    tags: ['No Nuts', 'Kosher'],
  },
];

const DonorDashboard: React.FC = () => {
  const navigate = useNavigate();
  const API_URL = 'http://localhost:8080';
  const { user } = useAuth();
  const userName = user?.email?.split('@')[0] || 'User';
  const [inventory, setInventory] = useState([]);
  useEffect(() => {
    fetchActiveInventory().then(setInventory).catch(console.error);
    //take match method
  }, [location.pathname]);

  const fetchActiveInventory = async () => {
    const response = await axios.get(`${API_URL}/inventory/active`, {
      withCredentials: true,
    });
    return response.data.inventory;
  };

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
