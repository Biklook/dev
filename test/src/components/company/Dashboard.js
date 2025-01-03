import React, { useState } from 'react';
import { useVessel } from '../../context/VesselContext'; // Importe le contexte
import {
  BarChart as RechartsBarChart,
  Bar,
  PieChart,
  Pie,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Clock, Activity, AlertTriangle, DollarSign, Ship, Wrench } from 'lucide-react';

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

function Dashboard() {
  const { vessels, records, equipmentHours, maintenanceAlerts } = useVessel(); // Récupère les données du contexte

  // États pour les filtres
  const [selectedVessel, setSelectedVessel] = useState('all'); // 'all' pour tous les navires
  const [selectedEquipment, setSelectedEquipment] = useState('all'); // 'all' pour tous les équipements
  const [showAllInfo, setShowAllInfo] = useState(true); // Afficher toutes les informations ou filtrer

  // Filtrer les données en fonction des sélections
  const filteredRecords = records.filter((record) => {
    const matchesVessel = selectedVessel === 'all' || record.vesselName === selectedVessel;
    const matchesEquipment = selectedEquipment === 'all' || record.equipmentName === selectedEquipment;
    return matchesVessel && matchesEquipment;
  });

  const filteredVessels = selectedVessel === 'all'
    ? vessels
    : vessels.filter((vessel) => vessel.vesselName === selectedVessel);

  // Calcul des KPIs
  const totalOperatingHours = Object.values(equipmentHours).reduce((a, b) => a + b, 0);
  const activeEquipment = Object.keys(equipmentHours).length;
  const pendingMaintenances = maintenanceAlerts.length;

  // Préparer les données pour les graphiques
  const equipmentUsageData = Object.entries(equipmentHours).map(([name, hours]) => ({
    name,
    hours,
  }));

  const activityData = filteredRecords.reduce((acc, record) => {
    acc[record.activity] = (acc[record.activity] || 0) + (record.workingHours || 0);
    return acc;
  }, {});

  const activityChartData = Object.entries(activityData).map(([name, hours]) => ({
    name,
    hours,
  }));

  return (
    <div className="space-y-6">
      {/* Filtres */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
          <Wrench className="h-5 w-5 mr-2 text-blue-500" />
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

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          icon={Clock}
          color="blue"
          title="Total Operating Hours"
          value={totalOperatingHours.toFixed(1)}
        />
        <KPICard
          icon={Activity}
          color="green"
          title="Active Equipment"
          value={activeEquipment}
        />
        <KPICard
          icon={AlertTriangle}
          color="yellow"
          title="Pending Maintenance"
          value={pendingMaintenances}
        />
        <KPICard
          icon={DollarSign}
          color="purple"
          title="Est. Operating Cost"
          value={(totalOperatingHours * 100).toLocaleString()}
        />
      </div>

      {/* Charts */}
      {(showAllInfo || (selectedVessel === 'all' && selectedEquipment === 'all')) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Equipment Usage</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsBarChart data={equipmentUsageData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={70} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="hours" fill="#3b82f6" name="Operating Hours" />
                  </RechartsBarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Activity Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={activityChartData}
                      dataKey="hours"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#3b82f6"
                      label
                    />
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
      
      {/* Section "Mes Navires" */}
      <div className="mt-8">
        <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
          <Ship className="h-5 w-5 mr-2 text-blue-500" />
          Mes Navires
        </h2>
        <div className="bg-white shadow rounded-lg p-6">
          {filteredVessels.length === 0 ? (
            <p className="text-gray-500">Aucun navire trouvé.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nom du Navire
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Numéro IMO
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type de Navire
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Année de Construction
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Pavillon
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredVessels.map((vessel, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap">{vessel.vesselName}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{vessel.imoNumber}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{vessel.vesselType}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{vessel.yearBuilt}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{vessel.flag}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Section "Historique des Opérations" */}
      <div className="mt-8">
        <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
          <Wrench className="h-5 w-5 mr-2 text-blue-500" />
          Historique des Opérations
        </h2>
        <div className="bg-white shadow rounded-lg p-6">
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
                      Activité
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Équipement
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Heures
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredRecords.map((record, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap">{record.vesselName}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{record.activity}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{record.equipmentName}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{record.workingHours.toFixed(1)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;