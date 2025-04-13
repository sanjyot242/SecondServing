import React from 'react';
import { HiOutlineCalendar, HiOutlineClipboardCheck } from 'react-icons/hi';

interface StatusCardProps {
  title: string;
  count: number;
  userType: 'shelter' | 'donor';
  icon?: 'calendar' | 'clipboard';
}

const StatusCard: React.FC<StatusCardProps> = ({
  title,
  count,
  userType,
  icon = 'clipboard',
}) => {
  const bgColorClass =
    userType === 'shelter' ? 'bg-shelter-dark' : 'bg-donor-dark';

  return (
    <div
      className={`${bgColorClass} rounded-lg p-4 text-white flex items-center space-x-4 hover-orbit`}>
      <div className='p-3 bg-white bg-opacity-10 rounded-full'>
        {icon === 'calendar' ? (
          <HiOutlineCalendar className='w-6 h-6 text-white' />
        ) : (
          <HiOutlineClipboardCheck className='w-6 h-6 text-white' />
        )}
      </div>
      <div>
        <h3 className='font-space text-sm opacity-80'>{title}</h3>
        <p className='font-future text-2xl'>{count}</p>
      </div>
    </div>
  );
};

export default StatusCard;
