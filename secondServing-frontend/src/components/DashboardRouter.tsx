import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Layout
import DashboardLayout from './DashboardLayout';

// Pages
import ShelterDashboard from './ShelterDashboard';
import DonorDashboard from './DonorDashboard';
import AddStockPage from './AddStockPage';
import CreateRequestPage from './CreateRequestPage';
import ViewRequestsPage from './ViewRequestPage';

// This component will replace your current Dashboard.tsx component
const DashboardRouter: React.FC = () => {
  const { userType } = useAuth();

  return (
    <DashboardLayout>
      <Routes>
        <Route
          path='/'
          element={
            userType === 'donator' ? <DonorDashboard /> : <ShelterDashboard />
          }
        />
        <Route path='/add-stock' element={<AddStockPage />} />
        <Route path='/create-request' element={<CreateRequestPage />} />
        <Route path='/your-requests' element={<ViewRequestsPage />} />
        <Route path='/requests' element={<ViewRequestsPage />} />

        {/* Add more routes as needed */}

        {/* Fallback to main dashboard */}
        <Route
          path='*'
          element={
            userType === 'donator' ? <DonorDashboard /> : <ShelterDashboard />
          }
        />
      </Routes>
    </DashboardLayout>
  );
};

export default DashboardRouter;
