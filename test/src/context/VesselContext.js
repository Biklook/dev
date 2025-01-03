import React, { createContext, useState, useContext } from 'react';

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
  'Generator': {
    inspectionHours: 1200,
    minorServiceHours: 3500,
    majorServiceHours: 7000,
  },
  'Boiler': {
    inspectionHours: 1000,
    minorServiceHours: 3000,
    majorServiceHours: 6000,
  },
  'Cargo Pumps': {
    inspectionHours: 800,
    minorServiceHours: 2000,
    majorServiceHours: 4000,
  },
  'Inert Gas System': {
    inspectionHours: 1000,
    minorServiceHours: 3000,
    majorServiceHours: 6000,
  },
  'COW System': {
    inspectionHours: 800,
    minorServiceHours: 2500,
    majorServiceHours: 5000,
  },
  'Container Crane': {
    inspectionHours: 500,
    minorServiceHours: 2000,
    majorServiceHours: 4000,
  },
  'Cargo Crane': {
    inspectionHours: 500,
    minorServiceHours: 2000,
    majorServiceHours: 4000,
  },
  'Reefer System': {
    inspectionHours: 800,
    minorServiceHours: 2000,
    majorServiceHours: 4000,
  },
  'Ventilation System': {
    inspectionHours: 1000,
    minorServiceHours: 2500,
    majorServiceHours: 5000,
  },
};

// Créer le contexte
export const VesselContext = createContext();

// Créer le provider
export const VesselProvider = ({ children }) => {
  const [vessels, setVessels] = useState([]);
  const [records, setRecords] = useState([]);
  const [equipmentHours, setEquipmentHours] = useState({});
  const [maintenanceAlerts, setMaintenanceAlerts] = useState([]);

  // Fonction pour vérifier les seuils de maintenance
  const checkMaintenanceThresholds = (equipmentName, totalHours) => {
    const schedule = maintenanceSchedule[equipmentName];
    
    if (schedule) {
      // Vérifier s'il existe déjà une alerte pour cet équipement
      const existingAlertIndex = maintenanceAlerts.findIndex(
        alert => alert.equipmentName === equipmentName
      );

      let newAlert = null;

      // Déterminer le type d'alerte en fonction des heures
      if (totalHours >= schedule.majorServiceHours) {
        newAlert = {
          id: Date.now(),
          equipmentName,
          type: 'major',
          message: `Maintenance majeure requise pour ${equipmentName} après ${totalHours.toFixed(1)} heures d'opération.`,
          priority: 'high',
          hours: totalHours,
          threshold: schedule.majorServiceHours
        };
      } else if (totalHours >= schedule.minorServiceHours) {
        newAlert = {
          id: Date.now(),
          equipmentName,
          type: 'minor',
          message: `Maintenance mineure requise pour ${equipmentName} après ${totalHours.toFixed(1)} heures d'opération.`,
          priority: 'medium',
          hours: totalHours,
          threshold: schedule.minorServiceHours
        };
      } else if (totalHours >= schedule.inspectionHours) {
        newAlert = {
          id: Date.now(),
          equipmentName,
          type: 'inspection',
          message: `Inspection requise pour ${equipmentName} après ${totalHours.toFixed(1)} heures d'opération.`,
          priority: 'low',
          hours: totalHours,
          threshold: schedule.inspectionHours
        };
      }

      // Mettre à jour les alertes si nécessaire
      if (newAlert) {
        if (existingAlertIndex >= 0) {
          // Mettre à jour l'alerte existante
          const updatedAlerts = [...maintenanceAlerts];
          updatedAlerts[existingAlertIndex] = newAlert;
          setMaintenanceAlerts(updatedAlerts);
        } else {
          // Ajouter une nouvelle alerte
          setMaintenanceAlerts(prevAlerts => [...prevAlerts, newAlert]);
        }
      }
    }
  };

  // Fonction pour ajouter un navire
  const addVessel = (newVessel) => {
    setVessels(prevVessels => [...prevVessels, newVessel]);
  };

  // Fonction pour ajouter un enregistrement
  const addRecord = (newRecord) => {
    setRecords(prevRecords => [...prevRecords, newRecord]);
  };

  // Fonction pour mettre à jour les heures d'équipement
  const updateEquipmentHours = (equipmentName, hours) => {
    setEquipmentHours(prev => {
      const newHours = (prev[equipmentName] || 0) + hours;
      checkMaintenanceThresholds(equipmentName, newHours);
      return {
        ...prev,
        [equipmentName]: newHours,
      };
    });
  };

  // Fonction pour supprimer un enregistrement
  const deleteRecord = (id) => {
    const recordToDelete = records.find(record => record.id === id);
    if (recordToDelete) {
      setEquipmentHours(prev => ({
        ...prev,
        [recordToDelete.equipmentName]: Math.max(
          0,
          (prev[recordToDelete.equipmentName] || 0) - recordToDelete.workingHours
        ),
      }));
      setRecords(prev => prev.filter(record => record.id !== id));
    }
  };

  // Fonction pour supprimer une alerte de maintenance
  const deleteMaintenanceAlert = (alertId) => {
    setMaintenanceAlerts(prevAlerts => 
      prevAlerts.filter(alert => alert.id !== alertId)
    );
  };

  // Fonction pour réinitialiser les heures d'un équipement après maintenance
  const resetEquipmentHours = (equipmentName) => {
    setEquipmentHours(prev => ({
      ...prev,
      [equipmentName]: 0
    }));
    // Supprimer les alertes associées
    setMaintenanceAlerts(prevAlerts => 
      prevAlerts.filter(alert => alert.equipmentName !== equipmentName)
    );
  };

  const assignVesselToStaffMember = (vesselId, staffId) => {
    setVessels(prevVessels => 
      prevVessels.map(vessel => {
        if (vessel.id === vesselId) {
          return {
            ...vessel,
            assignedStaff: [...(vessel.assignedStaff || []), staffId]
          };
        }
        return vessel;
      })
    );
  };

  const contextValue = {
    vessels,
    addVessel,
    records,
    addRecord,
    equipmentHours,
    updateEquipmentHours,
    maintenanceAlerts,
    deleteMaintenanceAlert,
    deleteRecord,
    resetEquipmentHours,
    maintenanceSchedule,
    assignVesselToStaffMember
  };

  return (
    <VesselContext.Provider value={contextValue}>
      {children}
    </VesselContext.Provider>
  );
};

// Hook personnalisé pour utiliser le contexte
export const useVessel = () => {
  const context = useContext(VesselContext);
  if (!context) {
    throw new Error('useVessel doit être utilisé dans un VesselProvider');
  }
  return context;
};