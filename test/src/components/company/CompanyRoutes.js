import React from 'react';
import { Routes, Route } from 'react-router-dom';
import CompanyDashboard from '../components/company/CompanyDashboard';
import VesselManagement from '../components/company/VesselManagement';
import Operations from '../components/company/Operations';
import Reports from '../components/company/Reports';

function CompanyRoutes() {
  return (
    <Routes>
      <Route path="/dashboard" element={<CompanyDashboard />} />
      <Route path="/vessels" element={<VesselManagement />} />
      <Route path="/operations" element={<Operations />} />
      <Route path="/reports" element={<Reports />} />
    </Routes>
  );
}

export default CompanyRoutes;