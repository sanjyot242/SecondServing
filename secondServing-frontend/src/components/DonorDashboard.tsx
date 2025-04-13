import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import UserWelcomeCard from './UserWelcomeCard';
import StatusCard from './StatusCard';
import ActionButton from './ActionButton';
import InventoryTable from './InventoryTable';

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
  const { user } = useAuth();
  const userName = user?.email?.split('@')[0] || 'User';

  return (
    <>
      <UserWelcomeCard name={userName} userType='shelter' />

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
          onClick={() => navigate('/dashboard/add-stock')}
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
          <InventoryTable items={SAMPLE_INVENTORY} />
        </div>
      </div>
    </>
  );
};

export default DonorDashboard;
