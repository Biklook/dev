import React from 'react';
import { BarChart2, Users, Settings } from 'lucide-react';

const AdminSidebar = ({ setActiveTab, activeTab }) => {
  return (
    <div className="w-64 bg-white shadow-lg h-full">
      <nav className="mt-5 px-2">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`flex items-center px-4 py-2 text-sm font-medium rounded-md w-full ${
            activeTab === 'dashboard'
              ? 'bg-blue-100 text-blue-700'
              : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          <BarChart2 className="h-5 w-5 mr-2" />
          Dashboard
        </button>

        <button
          onClick={() => setActiveTab('companies')}
          className={`flex items-center px-4 py-2 text-sm font-medium rounded-md w-full ${
            activeTab === 'companies'
              ? 'bg-blue-100 text-blue-700'
              : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          <Users className="h-5 w-5 mr-2" />
          Entreprises
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`flex items-center px-4 py-2 text-sm font-medium rounded-md w-full ${
            activeTab === 'settings'
              ? 'bg-blue-100 text-blue-700'
              : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          <Settings className="h-5 w-5 mr-2" />
          Paramètres
        </button>
      </nav>
    </div>
  );
};

export default AdminSidebar;