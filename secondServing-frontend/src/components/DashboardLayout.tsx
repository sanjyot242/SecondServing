import React, { ReactNode } from 'react';
import { Outlet } from 'react-router-dom';
import SideNavigation from './SideNavigation';
import { useAuth } from '../context/AuthContext';

interface DashboardLayoutProps {
  children?: ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { userType } = useAuth();

  // Default to 'shelter' if userType is null
  const userTypeValue = userType || 'shelter';

  return (
    <div className='flex min-h-screen bg-cosmos-void'>
      <SideNavigation userType={userTypeValue as 'shelter' | 'donator'} />

      <div className='flex-1 p-6 overflow-y-auto'>
        <div className='max-w-7xl mx-auto'>{children || <Outlet />}</div>
      </div>
    </div>
  );
};

export default DashboardLayout;
