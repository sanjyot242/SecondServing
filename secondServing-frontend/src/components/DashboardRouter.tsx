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

// This component handles routing for both shelter and donor dashboards
const DashboardRouter: React.FC = () => {
  const { userType } = useAuth();
  const isDonor = userType === 'donator';

  return (
    <DashboardLayout>
      <Routes>
        {/* Main dashboard - different for donors and shelters */}
        <Route
          path='/'
          element={isDonor ? <DonorDashboard /> : <ShelterDashboard />}
        />

        {/* Donor-specific routes */}
        {isDonor && (
          <>
            <Route path='/add-stock' element={<AddStockPage />} />
            <Route path='/requests' element={<ViewRequestsPage />} />
          </>
        )}

        {/* Shelter-specific routes */}
        {!isDonor && (
          <>
            <Route path='/create-request' element={<CreateRequestPage />} />
            <Route path='/your-requests' element={<ViewRequestsPage />} />
          </>
        )}

        {/* Fallback to main dashboard */}
        <Route
          path='*'
          element={isDonor ? <DonorDashboard /> : <ShelterDashboard />}
        />
      </Routes>
    </DashboardLayout>
  );
};

export default DashboardRouter;
