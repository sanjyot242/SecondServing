import React from 'react';
import { IconType } from 'react-icons';
import {
  HiOutlineHome,
  HiOutlineChartBar,
  HiOutlineInboxIn,
  HiOutlineLogout,
  HiOutlinePlus,
} from 'react-icons/hi';

interface NavItemProps {
  icon: IconType;
  label: string;
  active?: boolean;
  onClick?: () => void;
  badge?: number;
}

const NavItem: React.FC<NavItemProps> = ({
  icon: Icon,
  label,
  active,
  onClick,
  badge,
}) => {
  return (
    <li className='mb-2'>
      <button
        onClick={onClick}
        className={`flex items-center w-full py-3 px-4 rounded-lg text-left transition-all ${
          active
            ? 'bg-cosmos-stardust bg-opacity-20'
            : 'hover:bg-cosmos-stardust hover:bg-opacity-10'
        }`}>
        <Icon className='w-5 h-5 mr-3 text-white' />
        <span className='font-space text-white'>{label}</span>
        {badge !== undefined && (
          <span className='ml-auto bg-cosmos-orbit text-white text-xs rounded-full h-5 w-5 flex items-center justify-center'>
            {badge}
          </span>
        )}
      </button>
    </li>
  );
};

interface SideNavigationProps {
  userType: 'shelter' | 'donor';
}

const SideNavigation: React.FC<SideNavigationProps> = ({ userType }) => {
  return (
    <div className='w-64 bg-cosmos-nebula min-h-screen p-4'>
      <div className='mb-8'>
        <div className='flex items-center mb-8'>
          <div className='p-2'>
            <img src='/logo.svg' alt='RePlate' className='h-8' />
          </div>
          <h1 className='text-white font-future text-xl ml-2'>RePlate</h1>
        </div>
      </div>

      <nav>
        <ul>
          <NavItem icon={HiOutlineHome} label='Dashboard' active />
          {userType === 'shelter' && (
            <>
              <NavItem icon={HiOutlineChartBar} label='Analytics' />
              <NavItem icon={HiOutlineInboxIn} label='Requests' badge={1} />
            </>
          )}
          {userType === 'donor' && (
            <>
              <NavItem icon={HiOutlinePlus} label='Create Request' />
              <NavItem icon={HiOutlineInboxIn} label='Your Requests' />
            </>
          )}
        </ul>
      </nav>

      <div className='mt-auto pt-4 border-t border-cosmos-stardust absolute bottom-4 w-52'>
        <NavItem icon={HiOutlineLogout} label='Logout' />
      </div>
    </div>
  );
};

export default SideNavigation;
