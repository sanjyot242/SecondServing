import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
    title: 'Weekly Bread Pickup',
    createdDate: '3/29/2025, 10:14 AM',
    urgency: 'Medium' as const,
    status: 'Completed' as const,
    items: [
      { name: 'Bread', category: 'Baked Goods', quantity: 30, unit: 'loaves' },
      { name: 'Rolls', category: 'Baked Goods', quantity: 40, unit: 'pieces' },
    ],
    notes: 'Regular weekly pickup for our breakfast program',
  },
  {
    id: '3',
    title: 'Dairy Products',
    createdDate: '4/10/2025, 2:32 PM',
    urgency: 'Medium' as const,
    status: 'Active' as const,
    items: [
      { name: 'Milk', category: 'Dairy', quantity: 10, unit: 'gallons' },
      { name: 'Cheese', category: 'Dairy', quantity: 5, unit: 'lbs' },
      { name: 'Yogurt', category: 'Dairy', quantity: 20, unit: 'containers' },
    ],
    notes: "Needed for our children's meal program",
  },
];

const ViewRequestsPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('All');

  // Filter requests based on active tab
  const filteredRequests = SAMPLE_REQUESTS.filter((request) => {
    if (activeTab === 'All') return true;
    return request.status === activeTab;
  });

  const handleCancelRequest = (requestId: string) => {
    console.log(`Cancelling request ${requestId}`);
    // In a real app, you'd make an API call here
  };

  return (
    <div className='space-card'>
      <h1 className='font-future text-white text-xl mb-6'>
        Your Food Requests
      </h1>

      <TabNav
        tabs={['All', 'Active', 'Accepted', 'Completed']}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {filteredRequests.length === 0 ? (
        <div className='text-center py-12'>
          <p className='text-cosmos-station-base font-space'>
            No requests found for this filter.
          </p>
          <button
            onClick={() => navigate('/dashboard/create-request')}
            className='mt-4 shelter-button'>
            Create New Request
          </button>
        </div>
      ) : (
        <div className='space-y-6'>
          {filteredRequests.map((request) => (
            <RequestCard
              key={request.id}
              title={request.title}
              createdDate={request.createdDate}
              urgency={request.urgency}
              status={request.status}
              items={request.items}
              notes={request.notes}
              userType='shelter'
              onViewDetails={() =>
                navigate(`/dashboard/requests/${request.id}`)
              }
              onCancelRequest={
                request.status === 'Active'
                  ? () => handleCancelRequest(request.id)
                  : undefined
              }
            />
          ))}
        </div>
      )}

      <div className='flex justify-end mt-8'>
        <button
          onClick={() => navigate('/dashboard/create-request')}
          className='shelter-button'>
          New Request
        </button>
      </div>
    </div>
  );
};

export default ViewRequestsPage;
