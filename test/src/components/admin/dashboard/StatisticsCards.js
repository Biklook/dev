import React from 'react';
import { Users, Ship, Bell } from 'lucide-react';

const StatisticsCards = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-blue-100 bg-opacity-50">
            <Users className="h-6 w-6 text-blue-600" />
          </div>
          <div className="ml-4">
            <h2 className="text-sm font-medium text-gray-500">
              Total Entreprises
            </h2>
            <p className="text-2xl font-semibold text-gray-900">
              {stats?.companies || 0}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-green-100 bg-opacity-50">
            <Ship className="h-6 w-6 text-green-600" />
          </div>
          <div className="ml-4">
            <h2 className="text-sm font-medium text-gray-500">
              Total Navires
            </h2>
            <p className="text-2xl font-semibold text-gray-900">
              {stats?.vessels || 0}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-yellow-100 bg-opacity-50">
            <Bell className="h-6 w-6 text-yellow-600" />
          </div>
          <div className="ml-4">
            <h2 className="text-sm font-medium text-gray-500">
              Alertes Actives
            </h2>
            <p className="text-2xl font-semibold text-gray-900">
              {stats?.alerts || 0}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatisticsCards;