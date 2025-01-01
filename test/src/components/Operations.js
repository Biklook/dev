import React, { useState } from 'react';
import { useVessel } from '../context/VesselContext';
import { Ship, Wrench } from 'lucide-react';
import { shipTypeConfigurations } from '../config/shipTypes'; // Importez la configuration

// Configuration de maintenance
const maintenanceSchedule = {
  'Main Engine': {
    inspectionHours: 2000,
    minorServiceHours: 5000,
    majorServiceHours: 10000,
  },
  'Auxiliary Engine': {
    inspectionHours: 1500,
    minorServiceHours: 4000,
    majorServiceHours: 8000,
  },
  Generator: {
    inspectionHours: 1200,
    minorServiceHours: 3500,
    majorServiceHours: 7000,
  },
  Boiler: {
    inspectionHours: 1000,
    minorServiceHours: 3000,
    majorServiceHours: 6000,
  },
  Pump: {
    inspectionHours: 1000,
    minorServiceHours: 3000,
    majorServiceHours: 6000,
  },
  Compressor: {
    inspectionHours: 800,
    minorServiceHours: 2500,
    majorServiceHours: 5000,
  },
  Crane: {
    inspectionHours: 500,
    minorServiceHours: 2000,
    majorServiceHours: 4000,
  },
  Propeller: {
    inspectionHours: 2500,
    minorServiceHours: 5000,
    majorServiceHours: 10000,
  },
};

const Operations = () => {
  const {
    vessels,
    records,
    addRecord,
    equipmentHours,
    updateEquipmentHours,
    maintenanceAlerts,
    addMaintenanceAlert,
    deleteRecord,
  } = useVessel();

  // État pour le formulaire d'opération
  const [formData, setFormData] = useState({
    vesselId: '', // Sélection du navire par son ID
    status: 'navigation',
    activity: '',
    equipmentName: '',
    workingStartTime: '',
    workingStopTime: '',
    remarks: '',
  });

  // Récupérer le type de navire sélectionné
  const selectedVessel = vessels.find((vessel) => vessel.imoNumber === formData.vesselId);
  const vesselType = selectedVessel ? selectedVessel.vesselType : null;

  // Récupérer les équipements et activités disponibles
  const availableEquipment = vesselType ? shipTypeConfigurations[vesselType]?.equipment || [] : [];
  const availableActivities = vesselType ? shipTypeConfigurations[vesselType]?.activities || [] : [];

  // Calculer les heures de travail
  const calculateWorkingHours = (startTime, stopTime) => {
    const start = new Date(startTime);
    const stop = new Date(stopTime);
    return (stop - start) / (1000 * 60 * 60);
  };

  // Vérifier la maintenance nécessaire
  const checkMaintenance = (equipmentName, totalHours) => {
    const schedule = maintenanceSchedule[equipmentName];
    if (!schedule) return [];

    const alerts = [];
    if (totalHours >= schedule.majorServiceHours) {
      alerts.push({
        type: 'major',
        message: `Maintenance majeure requise pour ${equipmentName} (${totalHours.toFixed(1)} heures)`,
        priority: 'high',
      });
    } else if (totalHours >= schedule.minorServiceHours) {
      alerts.push({
        type: 'minor',
        message: `Maintenance mineure requise pour ${equipmentName} (${totalHours.toFixed(1)} heures)`,
        priority: 'medium',
      });
    } else if (totalHours >= schedule.inspectionHours) {
      alerts.push({
        type: 'inspection',
        message: `Inspection requise pour ${equipmentName} (${totalHours.toFixed(1)} heures)`,
        priority: 'low',
      });
    }
    return alerts;
  };

  // Gérer la soumission du formulaire
  const handleSubmit = (e) => {
    e.preventDefault();

    if (new Date(formData.workingStopTime) <= new Date(formData.workingStartTime)) {
      alert('L\'heure de fin doit être après l\'heure de début');
      return;
    }

    const workingHours = calculateWorkingHours(
      formData.workingStartTime,
      formData.workingStopTime
    );

    updateEquipmentHours(formData.equipmentName, workingHours);

    const newRecord = {
      id: Date.now(),
      vesselName: selectedVessel ? selectedVessel.vesselName : 'Inconnu',
      vesselType: selectedVessel ? selectedVessel.vesselType : 'Inconnu',
      ...formData,
      workingHours,
      dateAdded: new Date().toLocaleString(),
    };

    addRecord(newRecord);

    // Vérifier la maintenance
    const totalHours = equipmentHours[formData.equipmentName] + workingHours;
    const maintenanceNeeded = checkMaintenance(formData.equipmentName, totalHours);

    if (maintenanceNeeded.length > 0) {
      maintenanceNeeded.forEach((alert) => addMaintenanceAlert(alert));
    }

    // Réinitialiser le formulaire
    setFormData({
      vesselId: '',
      status: 'navigation',
      activity: '',
      equipmentName: '',
      workingStartTime: '',
      workingStopTime: '',
      remarks: '',
    });
  };

  // Gérer les changements du formulaire
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
          <Wrench className="h-5 w-5 mr-2 text-blue-500" />
          Nouvelle Opération
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Navire</label>
              <select
                name="vesselId"
                value={formData.vesselId}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              >
                <option value="">Sélectionnez un navire</option>
                {vessels.map((vessel) => (
                  <option key={vessel.imoNumber} value={vessel.imoNumber}>
                    {vessel.vesselName} ({vessel.vesselType})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Statut</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              >
                <option value="navigation">Navigation</option>
                <option value="anchorage">Ancrage</option>
                <option value="inPort">Au port</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Activité</label>
              <select
                name="activity"
                value={formData.activity}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              >
                <option value="">Sélectionnez une activité</option>
                {availableActivities.map((activity) => (
                  <option key={activity} value={activity}>
                    {activity}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Équipement</label>
              <select
                name="equipmentName"
                value={formData.equipmentName}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              >
                <option value="">Sélectionnez un équipement</option>
                {availableEquipment.map((equipment) => (
                  <option key={equipment} value={equipment}>
                    {equipment}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Heure de début</label>
              <input
                type="datetime-local"
                name="workingStartTime"
                value={formData.workingStartTime}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Heure de fin</label>
              <input
                type="datetime-local"
                name="workingStopTime"
                value={formData.workingStopTime}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Remarques</label>
            <textarea
              name="remarks"
              value={formData.remarks}
              onChange={handleChange}
              rows="3"
              className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() =>
                setFormData({
                  vesselId: '',
                  status: 'navigation',
                  activity: '',
                  equipmentName: '',
                  workingStartTime: '',
                  workingStopTime: '',
                  remarks: '',
                })
              }
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Réinitialiser
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Soumettre
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
          <Ship className="h-5 w-5 mr-2 text-blue-500" />
          Historique des Opérations
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Navire
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
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
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {records.map((record) => (
                <tr key={record.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{record.vesselName}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{record.status}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{record.activity}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{record.equipmentName}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{record.workingHours.toFixed(1)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => deleteRecord(record.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Operations;