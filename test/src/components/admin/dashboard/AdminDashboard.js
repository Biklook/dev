import React from 'react';
import StatisticsCards from './StatisticsCards';
import GlobalCharts from './GlobalCharts';

const AdminDashboard = () => {
  // Exemple de statistiques
  const stats = {
    companies: 12,
    vessels: 45,
    alerts: 8
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">
        Tableau de Bord Administrateur
      </h1>
      
      <StatisticsCards stats={stats} />
      <GlobalCharts />
    </div>
  );
};

export default AdminDashboard;