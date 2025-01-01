import React from 'react';
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { DollarSign, TrendingUp, TrendingDown } from 'lucide-react';

const Card = ({ children }) => (
  <div className="bg-white shadow rounded-lg overflow-hidden">{children}</div>
);

const CardHeader = ({ children }) => (
  <div className="px-6 py-4 border-b border-gray-200">{children}</div>
);

const CardTitle = ({ children }) => (
  <h2 className="text-lg font-medium text-gray-900">{children}</h2>
);

const CardContent = ({ children }) => (
  <div className="p-6">{children}</div>
);

function FinancialModule({ records, equipmentHours, maintenanceAlerts }) {
  // Coûts par type de maintenance
  const maintenanceCosts = {
    inspection: 1000,
    minor: 5000,
    major: 15000
  };

  // Coûts opérationnels par équipement (par heure)
  const operatingCosts = {
    'Main Engine': 150,
    'Auxiliary Engine': 100,
    'Generator': 80,
    'Boiler': 60,
    'Pump': 40,
    'Compressor': 50,
    'Crane': 70,
    'Propeller': 90
  };

  // Calcul des coûts opérationnels
  const calculateOperatingCosts = () => {
    return Object.entries(equipmentHours).reduce((total, [equipment, hours]) => {
      const hourlyRate = operatingCosts[equipment] || 0;
      return total + (hours * hourlyRate);
    }, 0);
  };

  // Calcul des coûts de maintenance
  const calculateMaintenanceCosts = () => {
    return maintenanceAlerts.reduce((total, alert) => {
      return total + maintenanceCosts[alert.type];
    }, 0);
  };

  // Calcul des économies grâce à la maintenance préventive
  const calculatePreventiveSavings = () => {
    const potentialBreakdowns = Object.values(equipmentHours).reduce((total, hours) => {
      return total + Math.floor(hours / 1000) * 0.3;
    }, 0);
    return potentialBreakdowns * maintenanceCosts.major;
  };

  const operatingCost = calculateOperatingCosts();
  const maintenanceCost = calculateMaintenanceCosts();
  const preventiveSavings = calculatePreventiveSavings();
  const roi = ((preventiveSavings - maintenanceCost) / maintenanceCost * 100).toFixed(2);

  // Données pour les graphiques
  const costBreakdownData = [
    { name: 'Operating Costs', amount: operatingCost },
    { name: 'Maintenance Costs', amount: maintenanceCost },
    { name: 'Estimated Savings', amount: preventiveSavings }
  ];

  return (
    <div className="space-y-6">
      {/* Financial KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent>
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-blue-100 rounded-full">
                <DollarSign className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Operating Costs</p>
                <h3 className="text-2xl font-bold">${operatingCost.toLocaleString()}</h3>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-green-100 rounded-full">
                <TrendingDown className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Maintenance Costs</p>
                <h3 className="text-2xl font-bold">${maintenanceCost.toLocaleString()}</h3>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-purple-100 rounded-full">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">ROI</p>
                <h3 className="text-2xl font-bold">{roi}%</h3>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Cost Analysis Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Cost Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsBarChart data={costBreakdownData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
                <Legend />
                <Bar dataKey="amount" fill="#8884d8" name="Amount ($)" />
              </RechartsBarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Financial Report */}
      <Card>
        <CardHeader>
          <CardTitle>Financial Impact Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold mb-2">Cost Breakdown</h4>
                <ul className="space-y-2">
                  <li>Daily Operating Cost: ${(operatingCost / 30).toFixed(2)}</li>
                  <li>Monthly Maintenance Cost: ${(maintenanceCost / 12).toFixed(2)}</li>
                  <li>Estimated Annual Savings: ${preventiveSavings.toLocaleString()}</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Efficiency Metrics</h4>
                <ul className="space-y-2">
                  <li>Cost per Operating Hour: ${(operatingCost / Object.values(equipmentHours).reduce((a, b) => a + b, 0)).toFixed(2)}</li>
                  <li>Maintenance Cost Ratio: {((maintenanceCost / operatingCost) * 100).toFixed(2)}%</li>
                  <li>Prevention Efficiency: {((preventiveSavings / maintenanceCost) * 100).toFixed(2)}%</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default FinancialModule;