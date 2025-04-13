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
  urgency: string;
  status: string;
  items: RequestItem[];
  notes?: string;
  userType: 'shelter' | 'donator';
  onViewDetails: () => void;
  onCancelRequest?: () => void;
  onFulfillRequest?: () => void;
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
  onFulfillRequest,
}) => {
  // Normalize status and urgency (convert to title case)
  const normalizedStatus =
    typeof status === 'string'
      ? status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()
      : 'Unknown';

  const normalizedUrgency =
    typeof urgency === 'string'
      ? urgency.charAt(0).toUpperCase() + urgency.slice(1).toLowerCase()
      : 'Medium';

  // Get appropriate CSS class based on urgency
  const getUrgencyClass = () => {
    switch (normalizedUrgency) {
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
    const statusLower = normalizedStatus.toLowerCase();

    if (statusLower === 'open' || statusLower === 'active') {
      return 'bg-cosmos-orbit text-white';
    } else if (statusLower === 'matched' || statusLower === 'accepted') {
      return 'bg-cosmos-satellite text-white';
    } else if (statusLower === 'fulfilled' || statusLower === 'completed') {
      return 'bg-cosmos-station-hull text-cosmos-void';
    } else if (statusLower === 'cancelled') {
      return 'bg-cosmos-mars text-white';
    } else {
      return 'bg-cosmos-station-hull';
    }
  };

  const buttonClass =
    userType === 'shelter' ? 'shelter-button' : 'donor-button';

  // Helper to determine if fulfill button should be shown
  const shouldShowFulfillButton = () => {
    if (userType !== 'donator' || !onFulfillRequest) return false;

    const statusLower = normalizedStatus.toLowerCase();
    // Show fulfill button for any open or matched request
    return (
      statusLower === 'matched' ||
      statusLower === 'open' ||
      statusLower === 'active'
    );
  };

  // Helper to determine if cancel button should be shown
  const shouldShowCancelButton = () => {
    if (userType !== 'shelter' || !onCancelRequest) return false;

    const statusLower = normalizedStatus.toLowerCase();
    return statusLower === 'open' || statusLower === 'active';
  };

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
            {normalizedUrgency} Urgency
          </span>
          <span
            className={`${getStatusClass()} px-3 py-1 rounded-full text-xs font-space`}>
            {normalizedStatus}
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
        {/* Cancel Request button - only shown for shelters with active requests */}
        {shouldShowCancelButton() && (
          <button
            onClick={onCancelRequest}
            className='px-4 py-2 rounded-capsule border border-cosmos-mars text-cosmos-mars font-space hover:bg-cosmos-mars hover:bg-opacity-10 transition-all'>
            Cancel Request
          </button>
        )}

        {/* Fulfill Request button - only shown for donors with matched requests */}
        {shouldShowFulfillButton() && (
          <button
            onClick={onFulfillRequest}
            className='px-4 py-2 rounded-capsule bg-cosmos-orbit text-white font-space hover:bg-opacity-90 transition-all'>
            Fulfill Request
          </button>
        )}

        {/* View Details button - always shown */}
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
