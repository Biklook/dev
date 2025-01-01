import React, { createContext, useState, useContext } from 'react';

// Créez le contexte
export const VesselContext = createContext();

// Créez le fournisseur de contexte
export const VesselProvider = ({ children }) => {
  // État pour stocker la liste des navires
  const [vessels, setVessels] = useState([]);

  // État pour stocker les enregistrements d'opérations
  const [records, setRecords] = useState([]);

  // État pour stocker les heures d'utilisation des équipements
  const [equipmentHours, setEquipmentHours] = useState({});

  // État pour stocker les alertes de maintenance
  const [maintenanceAlerts, setMaintenanceAlerts] = useState([]);

  // Fonction pour ajouter un navire
  const addVessel = (newVessel) => {
    setVessels((prevVessels) => [...prevVessels, newVessel]);
  };

  // Fonction pour ajouter un enregistrement d'opération
  const addRecord = (newRecord) => {
    setRecords((prevRecords) => [...prevRecords, newRecord]);
  };

  // Fonction pour mettre à jour les heures d'utilisation des équipements
  const updateEquipmentHours = (equipmentName, hours) => {
    setEquipmentHours((prev) => ({
      ...prev,
      [equipmentName]: (prev[equipmentName] || 0) + hours,
    }));
  };

  // Fonction pour ajouter une alerte de maintenance
  const addMaintenanceAlert = (alert) => {
    setMaintenanceAlerts((prevAlerts) => [...prevAlerts, alert]);
  };

  // Fonction pour supprimer un enregistrement d'opération
  const deleteRecord = (id) => {
    const recordToDelete = records.find((record) => record.id === id);
    if (recordToDelete) {
      setEquipmentHours((prev) => ({
        ...prev,
        [recordToDelete.equipmentName]: Math.max(
          0,
          (prev[recordToDelete.equipmentName] || 0) - recordToDelete.workingHours
        ),
      }));
    }
    setRecords((prev) => prev.filter((record) => record.id !== id));
  };

  // Valeur du contexte (partagée entre les composants)
  const contextValue = {
    vessels,
    addVessel,
    records,
    addRecord,
    equipmentHours,
    updateEquipmentHours,
    maintenanceAlerts,
    addMaintenanceAlert,
    deleteRecord,
  };

  return (
    <VesselContext.Provider value={contextValue}>
      {children}
    </VesselContext.Provider>
  );
};

// Créez un hook personnalisé pour utiliser le contexte
export const useVessel = () => {
  const context = useContext(VesselContext);
  if (!context) {
    throw new Error('useVessel doit être utilisé dans un VesselProvider');
  }
  return context;
};