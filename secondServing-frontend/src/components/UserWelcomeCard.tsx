import React from 'react';

interface UserWelcomeCardProps {
  name: string;
  userType: 'shelter' | 'donor';
}

const UserWelcomeCard: React.FC<UserWelcomeCardProps> = ({
  name,
  userType,
}) => {
  return (
    <div className='bg-white rounded-lg p-6 mb-6 flex items-center space-x-4'>
      <div className='flex-shrink-0'>
        <img
          src={
            userType === 'shelter'
              ? '/images/shelter-avatar.svg'
              : '/images/donor-avatar.svg'
          }
          alt='User avatar'
          className='w-16 h-16'
        />
      </div>
      <div>
        <h2 className='font-future text-lg text-cosmos-void'>Welcome</h2>
        <h1 className='font-space text-2xl font-medium text-cosmos-void'>
          {name}
        </h1>
        <p className='text-sm text-cosmos-station-metal font-space'>
          thank you for helping out ❤
        </p>
      </div>
    </div>
  );
};

export default UserWelcomeCard;
