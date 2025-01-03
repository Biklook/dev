import React, { useState } from 'react';
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { DollarSign, TrendingUp, TrendingDown } from 'lucide-react';
import { useVessel } from '../../context/VesselContext'; // Importe le contexte

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

// Composant KPI Card
const KPICard = ({ icon: Icon, color, title, value }) => (
  <Card>
    <CardContent>
      <div className="flex items-center space-x-4">
        <div className={`p-2 bg-${color}-100 rounded-full`}>
          <Icon className={`h-6 w-6 text-${color}-600`} />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <h3 className="text-2xl font-bold">{value}</h3>
        </div>
      </div>
    </CardContent>
  </Card>
);

function FinancialModule() {
  const { vessels, records, maintenanceAlerts } = useVessel(); // Récupère les données du contexte

  // États pour les filtres
  const [selectedVessel, setSelectedVessel] = useState('all'); // 'all' pour tous les navires
  const [selectedEquipment, setSelectedEquipment] = useState('all'); // 'all' pour tous les équipements
  const [showAllInfo, setShowAllInfo] = useState(true); // Afficher toutes les informations ou filtrer

  // Filtrer les opérations en fonction des sélections
  const filteredRecords = records.filter((record) => {
    const matchesVessel = selectedVessel === 'all' || record.vesselName === selectedVessel;
    const matchesEquipment = selectedEquipment === 'all' || record.equipmentName === selectedEquipment;
    return matchesVessel && matchesEquipment;
  });

  // Coûts par type de maintenance
  const maintenanceCosts = {
    inspection: 1000,
    minor: 5000,
    major: 15000,
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
    'Propeller': 90,
  };

  // Calcul des coûts opérationnels pour les opérations filtrées
  const calculateOperatingCosts = () => {
    return filteredRecords.reduce((total, record) => {
      const hourlyRate = operatingCosts[record.equipmentName] || 0;
      return total + record.workingHours * hourlyRate;
    }, 0);
  };

  // Calcul des coûts de maintenance pour les opérations filtrées
  const calculateMaintenanceCosts = () => {
    if (!Array.isArray(maintenanceAlerts)) return 0;
    return maintenanceAlerts.reduce((total, alert) => {
      return total + (maintenanceCosts[alert.type] || 0);
    }, 0);
  };

  // Calcul des économies grâce à la maintenance préventive
  const calculatePreventiveSavings = () => {
    const totalHours = filteredRecords.reduce((total, record) => total + record.workingHours, 0);
    const potentialBreakdowns = Math.floor(totalHours / 1000) * 0.3;
    return potentialBreakdowns * maintenanceCosts.major;
  };

  const operatingCost = calculateOperatingCosts();
  const maintenanceCost = calculateMaintenanceCosts();
  const preventiveSavings = calculatePreventiveSavings();
  const roi = maintenanceCost > 0 ? ((preventiveSavings - maintenanceCost) / maintenanceCost * 100).toFixed(2) : 0;

  // Calcul des métriques supplémentaires
  const monthlyMaintenanceCost = (maintenanceCost / 12).toFixed(2); // Coût mensuel de maintenance
  const maintenanceCostRatio = operatingCost > 0 ? ((maintenanceCost / operatingCost) * 100).toFixed(2) : 0; // Ratio coût de maintenance
  const preventionEfficiency = maintenanceCost > 0 ? ((preventiveSavings / maintenanceCost) * 100).toFixed(2) : 0; // Efficacité de la maintenance préventive

  // Données pour les graphiques
  const costBreakdownData = [
    { name: 'Operating Costs', amount: operatingCost },
    { name: 'Maintenance Costs', amount: maintenanceCost },
    { name: 'Estimated Savings', amount: preventiveSavings },
  ];

  return (
    <div className="space-y-6">
      {/* Filtres */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
          <DollarSign className="h-5 w-5 mr-2 text-blue-500" />
          Filtres
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Navire</label>
            <select
              value={selectedVessel}
              onChange={(e) => setSelectedVessel(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            >
              <option value="all">Tous les navires</option>
              {vessels.map((vessel) => (
                <option key={vessel.imoNumber} value={vessel.vesselName}>
                  {vessel.vesselName}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Équipement</label>
            <select
              value={selectedEquipment}
              onChange={(e) => setSelectedEquipment(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            >
              <option value="all">Tous les équipements</option>
              {Array.from(new Set(records.map((record) => record.equipmentName))).map((equipment) => (
                <option key={equipment} value={equipment}>
                  {equipment}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={() => setShowAllInfo(!showAllInfo)}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {showAllInfo ? 'Filtrer les informations' : 'Afficher toutes les informations'}
            </button>
          </div>
        </div>
      </div>

      {/* Financial KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <KPICard
          icon={DollarSign}
          color="blue"
          title="Operating Costs"
          value={`$${operatingCost.toLocaleString()}`}
        />
        <KPICard
          icon={TrendingDown}
          color="green"
          title="Maintenance Costs"
          value={`$${maintenanceCost.toLocaleString()}`}
        />
        <KPICard
          icon={TrendingUp}
          color="purple"
          title="ROI"
          value={`${roi}%`}
        />
      </div>

      {/* Cost Analysis Chart */}
      {(showAllInfo || (selectedVessel === 'all' && selectedEquipment === 'all')) && (
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
      )}

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
                  <li>Monthly Maintenance Cost: ${monthlyMaintenanceCost}</li>
                  <li>Estimated Annual Savings: ${preventiveSavings.toLocaleString()}</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Efficiency Metrics</h4>
                <ul className="space-y-2">
                  <li>Maintenance Cost Ratio: {maintenanceCostRatio}%</li>
                  <li>Prevention Efficiency: {preventionEfficiency}%</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Détails des opérations filtrées */}
      <Card>
        <CardHeader>
          <CardTitle>Détails des Opérations</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredRecords.length === 0 ? (
            <p className="text-gray-500">Aucune opération trouvée.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Navire
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Équipement
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Heures
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Coût Opérationnel
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredRecords.map((record, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap">{record.vesselName}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{record.equipmentName}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{record.workingHours.toFixed(1)}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        ${(record.workingHours * (operatingCosts[record.equipmentName] || 0)).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default FinancialModule;