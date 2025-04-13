import React from 'react';

interface UserWelcomeCardProps {
  name: string;
  userType: 'shelter' | 'donator';
}

const UserWelcomeCard: React.FC<UserWelcomeCardProps> = ({
  name,
  userType,
}) => {
  // Define which avatar image to use based on user type
  const avatarSrc =
    userType === 'shelter'
      ? '/Images/shelter-avatar.svg' // Update this path to your actual image
      : '/Images/donor-avatar.svg'; // Update this path to your actual image

  return (
    <div className='backdrop-blur-md bg-white/10 rounded-lg shadow-cosmos border border-white/10 p-6 mb-6'>
      <div className='flex items-center'>
        <div className='flex-shrink-0 mr-4'>
          {/* Placeholder SVG if image paths aren't available */}
          {!avatarSrc.includes('.svg') ? (
            <div className='w-20 h-20 rounded-full bg-cosmos-stardust flex items-center justify-center'>
              <svg
                viewBox='0 0 24 24'
                fill='none'
                className='w-12 h-12 text-white'>
                <path
                  d={
                    userType === 'shelter'
                      ? 'M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z'
                      : 'M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5'
                  }
                  stroke='currentColor'
                  strokeWidth='2'
                />
              </svg>
            </div>
          ) : (
            <img src={avatarSrc} alt='User avatar' className='w-20 h-20' />
          )}
        </div>
        <div>
          <h2 className='font-future text-lg text-white'>Welcome</h2>
          <h1 className='font-space text-2xl font-medium text-white'>{name}</h1>
          <p className='text-sm text-cosmos-station-base font-space'>
            thank you for helping out ❤
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserWelcomeCard;
