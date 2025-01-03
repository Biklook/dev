import React, { useState } from 'react';
import { useVessel } from '../../context/VesselContext';
import { Ship, Wrench, Clock } from 'lucide-react';
import { shipTypeConfigurations } from '../../config/shipTypes';

const Operations = () => {
  const {
    vessels,
    records,
    addRecord,
    equipmentHours,
    updateEquipmentHours,
    deleteRecord,
  } = useVessel();

  // État pour le formulaire d'opération
  const [formData, setFormData] = useState({
    vesselId: '',
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
    return (stop - start) / (1000 * 60 * 60); // Convertir en heures
  };

  // Gérer la soumission du formulaire
  const handleSubmit = (e) => {
    e.preventDefault();
  
    // Validation des champs obligatoires
    if (!formData.vesselId || !formData.equipmentName || !formData.workingStartTime || !formData.workingStopTime) {
      alert('Veuillez remplir tous les champs obligatoires.');
      return;
    }
  
    // Validation des heures
    if (new Date(formData.workingStopTime) <= new Date(formData.workingStartTime)) {
      alert('L\'heure de fin doit être après l\'heure de début.');
      return;
    }
  
    // Calculer les heures de travail
    const workingHours = calculateWorkingHours(formData.workingStartTime, formData.workingStopTime);
  
    // Créer le nouvel enregistrement
    const newRecord = {
      id: Date.now(),
      vesselName: selectedVessel ? selectedVessel.vesselName : 'Inconnu',
      vesselType: selectedVessel ? selectedVessel.vesselType : 'Inconnu',
      ...formData,
      workingHours,
      dateAdded: new Date().toLocaleString(),
    };

    // Ajouter l'enregistrement
    addRecord(newRecord);
    
    // Mettre à jour les heures d'équipement
    updateEquipmentHours(formData.equipmentName, workingHours);
  
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

  // Formater la date pour l'affichage
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('fr-FR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      {/* Formulaire d'opération */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
          <Wrench className="h-5 w-5 mr-2 text-blue-500" />
          Nouvelle Opération
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Sélection du navire */}
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

            {/* Statut */}
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

            {/* Activité */}
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

            {/* Équipement */}
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

            {/* Heure de début */}
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

            {/* Heure de fin */}
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

          {/* Remarques */}
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

          {/* Boutons */}
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

      {/* Historique des opérations */}
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
                  Date
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
                  <td className="px-6 py-4 whitespace-nowrap">{record.dateAdded}</td>
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



