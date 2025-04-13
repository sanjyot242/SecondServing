import React from 'react';

interface RequestItem {
  name: string;
  category?: string;
  quantity: number;
  unit: string;
}

interface RequestCardProps {
  title: string;
  createdDate: string;
  urgency: 'High' | 'Medium' | 'Low';
  status: 'Active' | 'Accepted' | 'Completed';
  items: RequestItem[];
  notes?: string;
  userType: 'shelter' | 'donor';
  onViewDetails: () => void;
  onCancelRequest?: () => void;
}

const RequestCard: React.FC<RequestCardProps> = ({
  title,
  createdDate,
  urgency,
  status,
  items,
  notes,
  userType,
  onViewDetails,
  onCancelRequest,
}) => {
  // Get appropriate CSS class based on urgency
  const getUrgencyClass = () => {
    switch (urgency) {
      case 'High':
        return 'bg-cosmos-mars text-white';
      case 'Medium':
        return 'bg-cosmos-jupiter text-cosmos-void';
      case 'Low':
        return 'bg-cosmos-station-hull text-cosmos-void';
      default:
        return 'bg-cosmos-station-hull';
    }
  };

  // Get appropriate CSS class based on status
  const getStatusClass = () => {
    switch (status) {
      case 'Active':
        return 'bg-cosmos-orbit text-white';
      case 'Accepted':
        return 'bg-cosmos-satellite text-white';
      case 'Completed':
        return 'bg-cosmos-station-hull text-cosmos-void';
      default:
        return 'bg-cosmos-station-hull';
    }
  };

  const buttonClass =
    userType === 'shelter' ? 'shelter-button' : 'donor-button';

  return (
    <div className='backdrop-blur-md bg-white/10 border border-white/10 rounded-lg p-4'>
      <div className='flex justify-between items-start mb-4'>
        <div>
          <h2 className='font-future text-white text-lg'>{title}</h2>
          <p className='text-sm text-cosmos-station-metal font-space'>
            Created on {createdDate}
          </p>
        </div>
        <div className='flex space-x-2'>
          <span
            className={`${getUrgencyClass()} px-3 py-1 rounded-full text-xs font-space`}>
            {urgency} Urgency
          </span>
          <span
            className={`${getStatusClass()} px-3 py-1 rounded-full text-xs font-space`}>
            {status}
          </span>
        </div>
      </div>

      <div className='mb-4'>
        <h3 className='font-space text-cosmos-station-base font-medium mb-2'>
          Requested Items:
        </h3>
        <div className='space-y-2'>
          {items.map((item, index) => (
            <div key={index} className='flex justify-between'>
              <div className='flex items-center'>
                <span className='text-white font-space'>{item.name}</span>
                {item.category && (
                  <span className='text-cosmos-station-metal text-sm ml-2'>
                    ({item.category})
                  </span>
                )}
              </div>
              <span className='text-cosmos-station-base font-space'>
                {item.quantity} {item.unit}
              </span>
            </div>
          ))}
        </div>
      </div>

      {notes && (
        <div className='mb-6'>
          <h3 className='font-space text-cosmos-station-base font-medium mb-2'>
            Notes:
          </h3>
          <p className='text-cosmos-station-base font-space'>{notes}</p>
        </div>
      )}

      <div className='flex justify-end space-x-3'>
        {onCancelRequest && status === 'Active' && (
          <button
            onClick={onCancelRequest}
            className='px-4 py-2 rounded-capsule border border-cosmos-mars text-cosmos-mars font-space hover:bg-cosmos-mars hover:bg-opacity-10 transition-all'>
            Cancel Request
          </button>
        )}
        <button
          onClick={onViewDetails}
          className={`px-4 py-2 rounded-capsule ${buttonClass} text-sm`}>
          View Details
        </button>
      </div>
    </div>
  );
};

export default RequestCard;
