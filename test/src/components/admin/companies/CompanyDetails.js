import React from 'react';
import { Ship, Users, Clock, AlertTriangle } from 'lucide-react';

const CompanyDetails = ({ company }) => {
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{company?.name}</h2>
        <p className="text-gray-500">ID: {company?.id}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center">
            <Ship className="h-6 w-6 text-blue-600" />
            <span className="ml-2 text-blue-600 font-medium">Navires</span>
          </div>
          <p className="text-2xl font-bold mt-2">{company?.vessels?.length || 0}</p>
        </div>

        <div className="bg-green-50 p-4 rounded-lg">
          <div className="flex items-center">
            <Users className="h-6 w-6 text-green-600" />
            <span className="ml-2 text-green-600 font-medium">Utilisateurs</span>
          </div>
          <p className="text-2xl font-bold mt-2">{company?.users?.length || 0}</p>
        </div>

        <div className="bg-yellow-50 p-4 rounded-lg">
          <div className="flex items-center">
            <AlertTriangle className="h-6 w-6 text-yellow-600" />
            <span className="ml-2 text-yellow-600 font-medium">Alertes</span>
          </div>
          <p className="text-2xl font-bold mt-2">{company?.alerts?.length || 0}</p>
        </div>

        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="flex items-center">
            <Clock className="h-6 w-6 text-purple-600" />
            <span className="ml-2 text-purple-600 font-medium">Dernière activité</span>
          </div>
          <p className="text-sm font-medium mt-2">{company?.lastActive || 'N/A'}</p>
        </div>
      </div>

      <div className="border-t pt-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Informations détaillées</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-gray-500">Date d'inscription</p>
            <p className="mt-1">{company?.createdAt || 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Statut</p>
            <p className="mt-1">
              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                company?.status === 'active' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {company?.status || 'N/A'}
              </span>
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Email</p>
            <p className="mt-1">{company?.email || 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Téléphone</p>
            <p className="mt-1">{company?.phone || 'N/A'}</p>
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-end space-x-3">
        <button 
          className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Modifier
        </button>
        <button 
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
        >
          Voir les navires
        </button>
      </div>
    </div>
  );
};

export default CompanyDetails;