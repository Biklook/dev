import React, { useState } from 'react';
import Dashboard from './components/Dashboard';
import FinancialModule from './components/FinancialModule';
import ISMModule from './components/ISMModule';
import UserManagement from './components/users/UserManagement';
import Login from './components/auth/Login';
import { useAuth } from './context/AuthContext';
import AddVessel from './components/vessels/AddVessel';
import Operations from './components/Operations';
import { VesselProvider } from './context/VesselContext';
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

// Configuration des types de navires
const shipTypeConfigurations = {
  tanker: {
    status: ['loading', 'discharging', 'ballasting', 'tank cleaning', 'inerting', 'COW'],
    equipment: [
      'Cargo Pumps',
      'Inert Gas System',
      'COW System',
      'Heating System',
      'Main Engine',
      'Auxiliary Engine',
      'Generator',
    ],
    activities: [
      'Cargo Operation',
      'Tank Cleaning',
      'Inerting',
      'Bunkering',
      'Maintenance',
      'Safety Rounds',
    ],
  },
  container: {
    status: ['loading', 'discharging', 'lashing', 'unlashing'],
    equipment: [
      'Container Crane',
      'Reefer System',
      'Lashing Equipment',
      'Main Engine',
      'Auxiliary Engine',
      'Generator',
    ],
    activities: [
      'Container Loading',
      'Container Unloading',
      'Reefer Monitoring',
      'Lashing Operation',
      'Maintenance',
    ],
  },
  bulkCarrier: {
    status: ['loading', 'discharging', 'hold cleaning', 'ventilating'],
    equipment: [
      'Cargo Crane',
      'Ventilation System',
      'Conveyor System',
      'Main Engine',
      'Auxiliary Engine',
      'Generator',
    ],
    activities: [
      'Bulk Loading',
      'Bulk Discharging',
      'Hold Cleaning',
      'Ventilation',
      'Maintenance',
    ],
  },
};

// Configuration de maintenance
const maintenanceSchedule = {
  'Main Engine': {
    inspectionHours: 2000,
    minorServiceHours: 5000,
    majorServiceHours: 10000,
  },
  'Auxiliary Engine': {
    inspectionHours: 1500,
    minorServiceHours: 4000,
    majorServiceHours: 8000,
  },
  Generator: {
    inspectionHours: 1200,
    minorServiceHours: 3500,
    majorServiceHours: 7000,
  },
  Boiler: {
    inspectionHours: 1000,
    minorServiceHours: 3000,
    majorServiceHours: 6000,
  },
  Pump: {
    inspectionHours: 1000,
    minorServiceHours: 3000,
    majorServiceHours: 6000,
  },
  Compressor: {
    inspectionHours: 800,
    minorServiceHours: 2500,
    majorServiceHours: 5000,
  },
  Crane: {
    inspectionHours: 500,
    minorServiceHours: 2000,
    majorServiceHours: 4000,
  },
  Propeller: {
    inspectionHours: 2500,
    minorServiceHours: 5000,
    majorServiceHours: 10000,
  },
};

// Composants de base
const Card = ({ children }) => (
  <div className="bg-white shadow rounded-lg overflow-hidden">{children}</div>
);
const CardHeader = ({ children }) => (
  <div className="px-6 py-4 border-b border-gray-200">{children}</div>
);
const CardTitle = ({ children }) => (
  <h2 className="text-lg font-medium text-gray-900">{children}</h2>
);
const CardContent = ({ children }) => <div className="p-6">{children}</div>;

function App() {
  const { auth, login, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [ismRecords, setISMRecords] = useState([]);

  // Vérifier si l'utilisateur est connecté
  if (!auth) {
    return <Login onLogin={login} />;
  }

  return (
    <VesselProvider>
      <div className="min-h-screen bg-gray-50">
        {/* Header avec navigation et profil */}
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
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Navigation des onglets */}
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

              <button
                onClick={() => setActiveTab('users')}
                className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                  activeTab === 'users'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Users className="h-5 w-5 mr-2" />
                Users
              </button>
            </nav>
          </div>

          {/* Contenu principal */}
          <div className="space-y-6">
            {activeTab === 'dashboard' && <Dashboard />}
            {activeTab === 'addVessel' && <AddVessel />}
            {activeTab === 'operations' && <Operations />}
            {activeTab === 'ism' && <ISMModule ismRecords={ismRecords} setISMRecords={setISMRecords} />}
            {activeTab === 'financial' && <FinancialModule />}
            {activeTab === 'maintenance' && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Maintenance Alerts</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Afficher les alertes de maintenance ici */}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
            {activeTab === 'users' && <UserManagement />}
          </div>
        </main>
      </div>
    </VesselProvider>
  );
}

export default App;