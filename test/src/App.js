import React, { useState } from 'react';
import Dashboard from './components/company/Dashboard';
import FinancialModule from './components/company/FinancialModule';
import ISMModule from './components/company/ISMModule';
import Login from './components/auth/Login';
import { useAuth } from './context/AuthContext';
import AddVessel from './components/vessels/AddVessel';
import Operations from './components/company/Operations';
import { VesselProvider } from './context/VesselContext';
import { StaffProvider } from './context/StaffContext'; // Nouveau
import MaintenanceAlerts from './components/company/MaintenanceAlerts';
import StaffManagement from './components/company/staff/StaffManagement'; // Nouveau
import { AdminProvider } from './context/AdminContext';
import AdminLayout from './components/admin/layout/AdminLayout';

import {
  Ship,
  Wrench,
  AlertTriangle,
  BarChart,
  DollarSign,
  User,
  Users,
  LogOut,
} from 'lucide-react';

function App() {
  const { auth, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');

  // Si l'utilisateur n'est pas connecté, afficher le login
  if (!auth) {
    return <Login />;
  }

  // Si l'utilisateur est admin, afficher l'interface admin
  if (auth.role === 'admin') {
    return (
      <AdminProvider>
        <AdminLayout />
      </AdminProvider>
    );
  }

  // Interface entreprise
  return (
    <StaffProvider>
      <VesselProvider>
        <div className="min-h-screen bg-gray-50">
          {/* Header */}
          <div className="bg-white shadow">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between h-16">
                <div className="flex items-center">
                  <Ship className="h-8 w-8 text-blue-600" />
                  <h1 className="ml-2 text-xl font-bold text-gray-900">
                    Marine Equipment Management
                  </h1>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <User className="h-5 w-5 text-gray-500" />
                    <span className="text-sm text-gray-700">{auth.user}</span>
                  </div>
                  <button
                    onClick={logout}
                    className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <LogOut className="h-5 w-5" />
                    <span>Déconnexion</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Navigation */}
            <div className="mb-6">
              <nav className="flex space-x-4">
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                    activeTab === 'dashboard'
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <BarChart className="h-5 w-5 mr-2" />
                  Dashboard
                </button>

                <button
                  onClick={() => setActiveTab('staff')} // Nouveau bouton
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                    activeTab === 'staff'
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Users className="h-5 w-5 mr-2" />
                  Personnel
                </button>

                <button
                  onClick={() => setActiveTab('addVessel')}
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                    activeTab === 'addVessel'
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Ship className="h-5 w-5 mr-2" />
                  Add Vessel
                </button>

                <button
                  onClick={() => setActiveTab('operations')}
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                    activeTab === 'operations'
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Ship className="h-5 w-5 mr-2" />
                  Operations
                </button>

                <button
                  onClick={() => setActiveTab('ism')}
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                    activeTab === 'ism'
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <AlertTriangle className="h-5 w-5 mr-2" />
                  ISM
                </button>

                <button
                  onClick={() => setActiveTab('financial')}
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                    activeTab === 'financial'
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <DollarSign className="h-5 w-5 mr-2" />
                  Financial
                </button>

                <button
                  onClick={() => setActiveTab('maintenance')}
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                    activeTab === 'maintenance'
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Wrench className="h-5 w-5 mr-2" />
                  Maintenance
                </button>
              </nav>
            </div>

            {/* Contenu principal */}
            <div className="space-y-6">
              {activeTab === 'dashboard' && <Dashboard />}
              {activeTab === 'staff' && <StaffManagement />} {/* Nouveau */}
              {activeTab === 'addVessel' && <AddVessel />}
              {activeTab === 'operations' && <Operations />}
              {activeTab === 'ism' && <ISMModule />}
              {activeTab === 'financial' && <FinancialModule />}
              {activeTab === 'maintenance' && (
                <div className="space-y-6">
                  <MaintenanceAlerts />
                </div>
              )}
            </div>
          </main>
        </div>
      </VesselProvider>
    </StaffProvider>
  );
}

export default App;