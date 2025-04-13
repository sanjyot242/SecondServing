import React from 'react';
import { HiOutlinePlus, HiOutlineMap } from 'react-icons/hi';

interface ActionButtonProps {
  label: string;
  icon: 'plus' | 'map';
  onClick: () => void;
  userType: 'shelter' | 'donor';
}

const ActionButton: React.FC<ActionButtonProps> = ({
  label,
  icon,
  onClick,
  userType,
}) => {
  const buttonClass =
    userType === 'shelter'
      ? 'shelter-button hover-orbit'
      : 'donor-button hover-orbit';

  return (
    <button
      onClick={onClick}
      className={`flex items-center justify-between ${buttonClass} w-full bg-white bg-opacity-5 border border-white border-opacity-10 rounded-lg p-4`}>
      <div className='flex items-center'>
        {icon === 'plus' ? (
          <HiOutlinePlus className='w-5 h-5 mr-2' />
        ) : (
          <HiOutlineMap className='w-5 h-5 mr-2' />
        )}
        <span>{label}</span>
      </div>
      <span className='text-lg'>&rarr;</span>
    </button>
  );
};

export default ActionButton;
