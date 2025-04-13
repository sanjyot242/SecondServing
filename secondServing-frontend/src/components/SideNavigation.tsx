import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  HiOutlineHome,
  HiOutlineChartBar,
  HiOutlineInboxIn,
  HiOutlinePlusCircle,
  HiOutlineLogout,
} from 'react-icons/hi';

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  badge?: number;
  onClick?: () => void;
}

const NavItem: React.FC<NavItemProps> = ({
  to,
  icon,
  label,
  badge,
  onClick,
}) => {
  return (
    <li className='mb-2'>
      <NavLink
        to={to}
        onClick={onClick}
        className={({ isActive }) => `
          flex items-center w-full py-3 px-4 rounded-lg text-left transition-all
          ${
            isActive
              ? 'bg-cosmos-stardust bg-opacity-20'
              : 'hover:bg-cosmos-stardust hover:bg-opacity-10'
          }
        `}>
        <span className='w-5 h-5 mr-3 text-white'>{icon}</span>
        <span className='font-space text-white'>{label}</span>
        {badge !== undefined && (
          <span className='ml-auto bg-cosmos-orbit text-white text-xs rounded-full h-5 w-5 flex items-center justify-center'>
            {badge}
          </span>
        )}
      </NavLink>
    </li>
  );
};

interface SideNavigationProps {
  userType: 'shelter' | 'donator';
}

const SideNavigation: React.FC<SideNavigationProps> = ({ userType }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className='w-64 bg-cosmos-nebula min-h-screen p-4 flex flex-col'>
      <div className='mb-8'>
        <div className='flex items-center mb-8'>
          <div className='p-2'>
            {/* Replace with your actual logo */}
            <svg viewBox='0 0 30 30' fill='none' className='h-8 w-8'>
              <path
                d='M15 3C8.373 3 3 8.373 3 15s5.373 12 12 12 12-5.373 12-12S21.627 3 15 3z'
                stroke='white'
                strokeWidth='2'
              />
              <path d='M10 15a5 5 0 0110 0v5H10v-5z' fill='#64B5F6' />
            </svg>
          </div>
          <h1 className='text-white font-future text-xl ml-2'>RePlate</h1>
        </div>
      </div>

      <nav className='flex-1'>
        <ul>
          <NavItem to='/dashboard' icon={<HiOutlineHome />} label='Dashboard' />

          {userType === 'donator' ? (
            <>
              <NavItem
                to='/dashboard/analytics'
                icon={<HiOutlineChartBar />}
                label='Analytics'
              />
              <NavItem
                to='/dashboard/requests'
                icon={<HiOutlineInboxIn />}
                label='Requests'
                badge={1}
              />
            </>
          ) : (
            <>
              <NavItem
                to='/dashboard/create-request'
                icon={<HiOutlinePlusCircle />}
                label='Create Request'
              />
              <NavItem
                to='/dashboard/your-requests'
                icon={<HiOutlineInboxIn />}
                label='Your Requests'
              />
            </>
          )}
        </ul>
      </nav>

      <div className='mt-auto pt-4 border-t border-cosmos-stardust'>
        <button
          onClick={handleLogout}
          className='flex items-center w-full py-3 px-4 rounded-lg text-left transition-all hover:bg-cosmos-stardust hover:bg-opacity-10'>
          <HiOutlineLogout className='w-5 h-5 mr-3 text-white' />
          <span className='font-space text-white'>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default SideNavigation;
