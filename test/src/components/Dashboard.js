import React from 'react';
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
import { Clock, Activity, AlertTriangle, DollarSign } from 'lucide-react';

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

function Dashboard({ records = [], equipmentHours = {}, maintenanceAlerts = [] }) {
  // Vérification des données
  const safeEquipmentHours = equipmentHours || {};
  const safeRecords = records || [];
  const safeMaintenanceAlerts = maintenanceAlerts || [];

  // Calcul des KPIs
  const totalOperatingHours = Object.values(safeEquipmentHours).reduce((a, b) => a + b, 0);
  const activeEquipment = Object.keys(safeEquipmentHours).length;
  const pendingMaintenances = safeMaintenanceAlerts.length;

  // Préparer les données pour les graphiques
  const equipmentUsageData = Object.entries(safeEquipmentHours).map(([name, hours]) => ({
    name,
    hours,
  }));

  const activityData = safeRecords.reduce((acc, record) => {
    acc[record.activity] = (acc[record.activity] || 0) + (record.workingHours || 0);
    return acc;
  }, {});

  const activityChartData = Object.entries(activityData).map(([name, hours]) => ({
    name,
    hours,
  }));

  return (
    <div className="space-y-6">
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
    </div>
  );
}

export default Dashboard;