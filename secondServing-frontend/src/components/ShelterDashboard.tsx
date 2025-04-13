import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import UserWelcomeCard from './UserWelcomeCard';
import StatusCard from './StatusCard';
import ActionButton from './ActionButton';
import TabNav from './TabNav';
import RequestCard from './RequestCard';

// Sample request data
const SAMPLE_REQUESTS = [
  {
    id: '1',
    title: 'Emergency Food Supplies',
    createdDate: '4/6/2025, 9:54 AM',
    urgency: 'High' as const,
    status: 'Active' as const,
    items: [
      { name: 'Tomatoes', category: 'Produce', quantity: 20, unit: 'lbs' },
    ],
    notes:
      'We need fresh tomatoes for our soup kitchen that serves 100 people daily',
  },
  {
    id: '2',
    title: 'Essentials',
    createdDate: '4/6/2025, 10:14 AM',
    urgency: 'Medium' as const,
    status: 'Active' as const,
    items: [
      { name: 'Rice', category: 'Grains', quantity: 50, unit: 'lbs' },
      { name: 'Beans', category: 'Canned Goods', quantity: 30, unit: 'cans' },
    ],
    notes: 'Regular stock replenishment for our weekly meal program',
  },
];

const ShelterDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const userName = user?.email?.split('@')[0] || 'User';

  const [activeTab, setActiveTab] = useState('All');

  return (
    <>
      <UserWelcomeCard name={`${userName} Johnson`} userType='donor' />

      <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-8'>
        <StatusCard
          title='Requested Deliveries'
          count={2}
          userType='donor'
          icon='clipboard'
        />

        <ActionButton
          label='Request Stock'
          icon='plus'
          onClick={() => navigate('/dashboard/create-request')}
          userType='donor'
        />
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        <div className='lg:col-span-2'>
          <div className='space-card'>
            <TabNav
              tabs={['All', 'Active', 'Accepted', 'Completed']}
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />

            <div className='space-y-6'>
              {SAMPLE_REQUESTS.map((request) => (
                <RequestCard
                  key={request.id}
                  title={request.title}
                  createdDate={request.createdDate}
                  urgency={request.urgency}
                  status={request.status}
                  items={request.items}
                  notes={request.notes}
                  userType='donor'
                  onViewDetails={() =>
                    navigate(`/dashboard/requests/${request.id}`)
                  }
                  onCancelRequest={() =>
                    console.log(`Cancel request ${request.id}`)
                  }
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ShelterDashboard;
