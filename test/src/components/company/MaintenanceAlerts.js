import React from 'react';
import { AlertTriangle, Wrench, RotateCcw, Clock } from 'lucide-react';
import { useVessel } from '../../context/VesselContext';

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

const getPriorityColor = (priority) => {
  switch (priority) {
    case 'high':
      return 'bg-red-100 border-red-200 text-red-800';
    case 'medium':
      return 'bg-yellow-100 border-yellow-200 text-yellow-800';
    case 'low':
      return 'bg-blue-100 border-blue-200 text-blue-800';
    default:
      return 'bg-gray-100 border-gray-200 text-gray-800';
  }
};

const getPriorityIcon = (priority) => {
  switch (priority) {
    case 'high':
      return <AlertTriangle className="h-5 w-5 text-red-500" />;
    case 'medium':
      return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
    case 'low':
      return <Clock className="h-5 w-5 text-blue-500" />;
    default:
      return <Wrench className="h-5 w-5 text-gray-500" />;
  }
};

function MaintenanceAlerts() {
  const { 
    maintenanceAlerts, 
    deleteMaintenanceAlert, 
    equipmentHours,
    resetEquipmentHours,
    maintenanceSchedule
  } = useVessel();

  // Calculer le statut de maintenance pour un équipement
  const getMaintenanceStatus = (equipment, hours) => {
    const schedule = maintenanceSchedule[equipment];
    if (!schedule) return null;

    const percentToNext = (nextThreshold, currentHours) => {
      return Math.min((currentHours / nextThreshold) * 100, 100).toFixed(1);
    };

    let nextService = null;
    let progress = 0;
    let timeRemaining = 0;
    let nextThreshold = 0;

    if (hours < schedule.inspectionHours) {
      nextService = "inspection";
      nextThreshold = schedule.inspectionHours;
      progress = percentToNext(schedule.inspectionHours, hours);
      timeRemaining = schedule.inspectionHours - hours;
    } else if (hours < schedule.minorServiceHours) {
      nextService = "maintenance mineure";
      nextThreshold = schedule.minorServiceHours;
      progress = percentToNext(schedule.minorServiceHours, hours);
      timeRemaining = schedule.minorServiceHours - hours;
    } else if (hours < schedule.majorServiceHours) {
      nextService = "maintenance majeure";
      nextThreshold = schedule.majorServiceHours;
      progress = percentToNext(schedule.majorServiceHours, hours);
      timeRemaining = schedule.majorServiceHours - hours;
    } else {
      nextService = "maintenance majeure URGENTE";
      progress = 100;
      timeRemaining = 0;
    }

    return { 
      nextService, 
      progress, 
      timeRemaining: Math.max(0, timeRemaining).toFixed(1),
      nextThreshold
    };
  };

  // Fonction pour confirmer la réinitialisation
  const handleReset = (equipment) => {
    if (window.confirm(`Confirmer la réinitialisation des heures pour ${equipment} ?`)) {
      resetEquipmentHours(equipment);
    }
  };

  // Fonction pour confirmer la suppression d'alerte
  const handleDeleteAlert = (alertId, equipmentName) => {
    if (window.confirm(`Supprimer l'alerte pour ${equipmentName} ?`)) {
      deleteMaintenanceAlert(alertId);
    }
  };

  return (
    <div className="space-y-6">
      {/* État des équipements */}
      <Card>
        <CardHeader>
          <CardTitle>
            <div className="flex items-center">
              <Wrench className="h-5 w-5 mr-2 text-blue-500" />
              État des Équipements
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(equipmentHours).map(([equipment, hours]) => {
              const status = getMaintenanceStatus(equipment, hours);
              if (!status) return null;

              const progressColor = 
                status.progress >= 90 ? 'bg-red-500' :
                status.progress >= 75 ? 'bg-yellow-500' :
                'bg-blue-500';

              return (
                <div key={equipment} className="p-4 border rounded-lg bg-white hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium text-gray-900">{equipment}</h3>
                    <button
                      onClick={() => handleReset(equipment)}
                      className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                      title="Réinitialiser les heures après maintenance"
                    >
                      <RotateCcw className="h-4 w-4 text-gray-500" />
                    </button>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    {hours.toFixed(1)} heures d'opération
                  </p>
                  <div className="relative pt-1">
                    <div className="overflow-hidden h-2 mb-2 text-xs flex rounded bg-gray-200">
                      <div
                        className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${progressColor}`}
                        style={{ width: `${status.progress}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-600">
                      <span>{status.progress}%</span>
                      <span>{status.timeRemaining}h restantes</span>
                    </div>
                  </div>
                  <p className="mt-2 text-sm font-medium" style={{
                    color: status.progress >= 90 ? '#EF4444' : 
                           status.progress >= 75 ? '#F59E0B' : '#3B82F6'
                  }}>
                    Prochaine {status.nextService}
                  </p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Alertes de maintenance */}
      <Card>
        <CardHeader>
          <CardTitle>
            <div className="flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2 text-yellow-500" />
              Alertes de Maintenance Actives
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {maintenanceAlerts.length === 0 ? (
            <div className="text-center p-6 text-gray-500">
              <Wrench className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p>Aucune alerte de maintenance active</p>
            </div>
          ) : (
            <div className="space-y-4">
              {maintenanceAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`p-4 border rounded-lg ${getPriorityColor(alert.priority)}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="space-y-1 flex-grow">
                      <h3 className="text-lg font-semibold flex items-center">
                        {getPriorityIcon(alert.priority)}
                        <span className="ml-2">{alert.equipmentName}</span>
                      </h3>
                      <p className="text-sm">{alert.message}</p>
                      <div className="flex items-center space-x-4 text-sm">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-white bg-opacity-50">
                          Type: {alert.type}
                        </span>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-white bg-opacity-50">
                          Priorité: {alert.priority}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleReset(alert.equipmentName)}
                        className="p-2 hover:bg-white hover:bg-opacity-25 rounded-full transition-colors"
                        title="Réinitialiser les heures après maintenance"
                      >
                        <RotateCcw className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteAlert(alert.id, alert.equipmentName)}
                        className="p-2 hover:bg-white hover:bg-opacity-25 rounded-full transition-colors text-sm font-medium"
                        title="Supprimer l'alerte"
                      >
                        Supprimer
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default MaintenanceAlerts;