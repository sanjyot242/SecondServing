import React from 'react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import UserWelcomeCard from './UserWelcomeCard';
import StatusCard from './StatusCard';
import ActionButton from './ActionButton';
import TabNav from './TabNav';
import RequestCard from './RequestCard';
import axios from 'axios';
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
  const { userType } = useAuth();
  const userTypeValue = userType || 'shelter';
  const navigate = useNavigate();
  const API_URL = 'http://localhost:8080';
  const { user } = useAuth();
  const userName = user?.email?.split('@')[0] || 'User';

  const [activeTab, setActiveTab] = useState('All');

  const [requests, setRequests] = useState([]);

  useEffect(() => {
    fetchReceiverRequests()
      .then(setRequests)
      .catch((err) => {
        console.error('Failed to fetch requests', err);
      });
  }, []);

  const fetchReceiverRequests = async () => {
    const response = await axios.get(`${API_URL}/receiver/requests`, {
      withCredentials: true,
    });
    return response.data;
  };

  const filteredRequests =
    activeTab === 'All'
      ? requests
      : requests.filter((r: any) => r.status === activeTab);

  return (
    <>
      <UserWelcomeCard name={`${userName} Johnson`} userType='shelter' />

      <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-8'>
        <StatusCard
          title='Requested Deliveries'
          count={requests.length}
          userType={userTypeValue}
          icon='clipboard'
        />

        <ActionButton
          label='Request Stock'
          icon='plus'
          onClick={() => navigate('/dashboard/create-request')}
          userType={userTypeValue}
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
              {filteredRequests.map((request: any) => (
                <RequestCard
                  key={request.id}
                  title={request.title}
                  createdDate={new Date(request.created_at).toLocaleString()}
                  urgency={request.urgency}
                  status={request.status}
                  items={request.items}
                  notes={request.notes}
                  userType={userTypeValue}
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
