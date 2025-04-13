import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TabNav from './TabNav';
import RequestCard from './RequestCard';
import { useAuth } from '../context/AuthContext';
import {
  fetchOpenRequests,
  fetchReceiverRequests,
  fulfillFoodRequest,
  fulfillRequestDirectly,
} from '../api/requests';

// Define interfaces for type safety
interface RequestItem {
  name: string;
  category?: string;
  quantity: number;
  unit: string;
}

interface Request {
  id: number;
  title: string;
  created_at: string;
  urgency: string;
  status: string;
  notes?: string;
  requested_item?: string;
  category?: string;
  quantity?: number;
  matched_item_id?: number;
  items?: RequestItem[];
}

const ViewRequestsPage: React.FC = () => {
  const { userType, user } = useAuth();
  const userTypeValue = userType || 'shelter';
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('All');
  const [requests, setRequests] = useState<Request[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch requests based on user type
  useEffect(() => {
    const loadRequests = async () => {
      setIsLoading(true);
      setError('');

      try {
        let requestData;

        if (userTypeValue === 'shelter') {
          // Fetch requests made by this shelter
          requestData = await fetchReceiverRequests();
        } else {
          // For donors, fetch all open requests they can fulfill directly
          requestData = await fetchOpenRequests();
        }

        setRequests(requestData);
      } catch (err) {
        console.error('Failed to load requests:', err);
        setError('Failed to load requests. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    loadRequests();
  }, [userTypeValue, activeTab]);

  // Filter requests based on active tab
  const filteredRequests = requests.filter((request) => {
    if (activeTab === 'All') return true;
    return (
      request.status === activeTab ||
      request.status.toLowerCase() === activeTab.toLowerCase()
    );
  });

  const handleCancelRequest = (requestId: number) => {
    console.log(`Cancelling request ${requestId}`);
    // In a real app, you'd make an API call here
  };

  const handleFulfillRequest = async (requestId: number, foodId?: number) => {
    try {
      // If foodId is provided, use the food fulfillment method
      // Otherwise use the direct request fulfillment
      if (foodId) {
        await fulfillFoodRequest(foodId);
      } else {
        await fulfillRequestDirectly(requestId);
      }

      // Refresh requests after fulfillment
      if (userTypeValue === 'shelter') {
        const updatedRequests = await fetchReceiverRequests();
        setRequests(updatedRequests);
      } else {
        const updatedRequests = await fetchOpenRequests();
        setRequests(updatedRequests);
      }
    } catch (err) {
      console.error('Error fulfilling request:', err);
      setError('Failed to fulfill request. Please try again.');
    }
  };

  // Helper function to safely create RequestItem objects
  const getRequestItems = (request: Request): RequestItem[] => {
    if (request.items && request.items.length > 0) {
      return request.items;
    }

    return [
      {
        name: request.requested_item || 'Unknown Item', // Default name if undefined
        category: request.category,
        quantity: request.quantity !== undefined ? request.quantity : 0, // Default quantity if undefined
        unit: 'units',
      },
    ];
  };

  return (
    <div className='space-card'>
      <h1 className='font-future text-white text-xl mb-6'>
        {userTypeValue === 'shelter'
          ? 'Your Food Requests'
          : 'Available Food Requests'}
      </h1>

      <TabNav
        tabs={['All', 'Open', 'Matched', 'Fulfilled']}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {isLoading ? (
        <div className='text-center py-12'>
          <p className='text-cosmos-station-base font-space'>
            Loading requests...
          </p>
        </div>
      ) : error ? (
        <div className='text-center py-12'>
          <p className='text-cosmos-mars font-space'>{error}</p>
          <button
            onClick={() => window.location.reload()}
            className='mt-4 shelter-button'>
            Try Again
          </button>
        </div>
      ) : filteredRequests.length === 0 ? (
        <div className='text-center py-12'>
          <p className='text-cosmos-station-base font-space'>
            No requests found for this filter.
          </p>
          {userTypeValue === 'shelter' && (
            <button
              onClick={() => navigate('/dashboard/create-request')}
              className='mt-4 shelter-button'>
              Create New Request
            </button>
          )}
        </div>
      ) : (
        <div className='space-y-6'>
          {filteredRequests.map((request) => (
            <RequestCard
              key={request.id}
              title={request.title}
              createdDate={new Date(request.created_at).toLocaleString()}
              urgency={request.urgency}
              status={request.status}
              items={getRequestItems(request)}
              notes={request.notes}
              userType={userTypeValue}
              onViewDetails={() =>
                navigate(`/dashboard/requests/${request.id}`)
              }
              onCancelRequest={
                request.status === 'Open' || request.status === 'Active'
                  ? () => handleCancelRequest(request.id)
                  : undefined
              }
              onFulfillRequest={
                userTypeValue === 'donator' &&
                (request.status === 'Open' ||
                  request.status === 'open' ||
                  request.status === 'Matched' ||
                  request.status === 'matched')
                  ? () =>
                      handleFulfillRequest(request.id, request.matched_item_id)
                  : undefined
              }
            />
          ))}
        </div>
      )}

      {userTypeValue === 'shelter' && (
        <div className='flex justify-end mt-8'>
          <button
            onClick={() => navigate('/dashboard/create-request')}
            className='shelter-button'>
            New Request
          </button>
        </div>
      )}
    </div>
  );
};

export default ViewRequestsPage;
