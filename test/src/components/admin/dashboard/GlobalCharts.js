import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const GlobalCharts = () => {
  // Données d'exemple
  const data = [
    { name: 'Jan', companies: 4 },
    { name: 'Fév', companies: 6 },
    { name: 'Mars', companies: 8 },
    { name: 'Avr', companies: 10 },
  ];

  return (
    <div className="bg-white rounded-lg shadow p-6 mt-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">
        Évolution des Inscriptions
      </h2>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="companies" fill="#3B82F6" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default GlobalCharts;