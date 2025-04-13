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
    <div className="flex min-h-screen bg-cover bg-center bg-no-repeat" style={{ backgroundImage: 'url(../../public/Images/bg-1.jpg)' }}>
      {/* Side Navigation */}
      <SideNavigation userType={userTypeValue as 'shelter' | 'donator'} />

      {/* Main Content */}
      <div className="flex-1 p-8 md:p-16 rounded-lg mx-auto my-4 ">
        <div className="max-w-7xl mx-auto text-white">
          {children || <Outlet />}
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
