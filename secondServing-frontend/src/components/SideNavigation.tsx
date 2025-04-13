import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { HiOutlineHome, HiOutlineChartBar, HiOutlineInboxIn, HiOutlinePlusCircle, HiOutlineLogout, HiOutlineMenu, HiOutlineChevronLeft } from 'react-icons/hi';
import { useAuth } from '../context/AuthContext';

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  badge?: number;
  onClick?: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ to, icon, label, badge, onClick }) => {
  return (
    <li className="mb-2">
      <NavLink
        to={to}
        onClick={onClick}
        className={({ isActive }) =>
          `flex items-center w-full py-3 px-4 rounded-lg text-left transition-all ${
            isActive ? 'bg-cosmos-stardust bg-opacity-20' : 'hover:bg-cosmos-stardust hover:bg-opacity-10'
          }`
        }
      >
        <span className="w-5 h-5 mr-3 text-white">{icon}</span>
        {/* Show label if sidebar is expanded */}
        <span className="font-space text-white">{label}</span>
        {badge !== undefined && (
          <span className="ml-auto bg-cosmos-orbit text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
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
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);  // For handling sidebar collapse/expand
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

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev); // Toggle sidebar state
  };

  return (
    <div className={`flex min-h-screen transition-all duration-300 ease-in-out`}>
      {/* Sidebar */}
      <div
        className={`${
          isSidebarOpen ? 'w-64' : 'w-20' // Sidebar width changes based on state
        } bg-cosmos-nebula min-h-screen p-4 flex flex-col overflow-hidden transition-all duration-300 ease-in-out`}
        style={{ position: 'fixed', top: 0, bottom: 0 }}
      >
        {/* Logo and Title */}
        <div className="mb-8 flex items-center justify-between">
          <div className="p-2">
            <img
              src="/public/Images/logo.png"
              alt="Second Serving Logo"
              className="h-10 w-10"
            />
          </div>
          {isSidebarOpen && <h1 className="text-white font-future text-xl ml-2">Second Serving</h1>}
          {/* Button to collapse/expand the sidebar */}
          <button
            onClick={toggleSidebar}
            className="text-white p-2 rounded-full bg-cosmos-orbit hover:bg-cosmos-stardust"
          >
            {isSidebarOpen ? <HiOutlineChevronLeft size={24} /> : <HiOutlineMenu size={24} />}
          </button>
        </div>

        {/* Sidebar Menu */}
        <nav className="flex-1 overflow-y-auto">
          <ul>
            <NavItem to="/dashboard" icon={<HiOutlineHome />} label="Dashboard" />
            {userType === 'donator' ? (
              <>
                <NavItem to="/dashboard/analytics" icon={<HiOutlineChartBar />} label="Analytics" />
                <NavItem to="/dashboard/requests" icon={<HiOutlineInboxIn />} label="Requests" badge={1} />
              </>
            ) : (
              <>
                <NavItem to="/dashboard/create-request" icon={<HiOutlinePlusCircle />} label="Create Request" />
                <NavItem to="/dashboard/your-requests" icon={<HiOutlineInboxIn />} label="Your Requests" />
              </>
            )}
          </ul>
        </nav>

        {/* Logout Button */}
        <div className="mt-auto pt-4 border-t border-cosmos-stardust">
          <button
            onClick={handleLogout}
            className="flex items-center w-full py-3 px-4 rounded-lg text-left transition-all hover:bg-cosmos-stardust hover:bg-opacity-10"
          >
            <HiOutlineLogout className="w-5 h-5 mr-3 text-white" />
            {isSidebarOpen && <span className="font-space text-white">Logout</span>}
          </button>
        </div>
      </div>

      {/* Main content area */}
      <div className="flex-1 ml-64 p-6">
        {/* Content goes here */}
      </div>
    </div>
  );
};

export default SideNavigation;
