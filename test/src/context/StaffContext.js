import React, { createContext, useContext, useState } from 'react';
import { STAFF_ROLES } from '../components/company/staff/StaffRoles';

const StaffContext = createContext();

export function StaffProvider({ children }) {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const addStaffMember = async (newStaffData) => {
    try {
      setLoading(true);
      // Ici, vous ajouterez l'appel à votre API
      const newStaff = {
        id: Date.now().toString(),
        ...newStaffData,
        permissions: STAFF_ROLES[newStaffData.role].permissions,
        status: 'active',
        dateAdded: new Date().toISOString()
      };

      setStaff(prevStaff => [...prevStaff, newStaff]);
    } catch (err) {
      setError('Erreur lors de l\'ajout du membre du personnel');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateStaffMember = async (id, updatedData) => {
    try {
      setLoading(true);
      // Ici, vous ajouterez l'appel à votre API
      setStaff(prevStaff =>
        prevStaff.map(member =>
          member.id === id
            ? { ...member, ...updatedData }
            : member
        )
      );
    } catch (err) {
      setError('Erreur lors de la mise à jour du membre du personnel');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const deleteStaffMember = async (id) => {
    try {
      setLoading(true);
      // Ici, vous ajouterez l'appel à votre API
      setStaff(prevStaff => prevStaff.filter(member => member.id !== id));
    } catch (err) {
      setError('Erreur lors de la suppression du membre du personnel');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const assignVesselToStaff = async (staffId, vesselId) => {
    try {
      setLoading(true);
      setStaff(prevStaff =>
        prevStaff.map(member =>
          member.id === staffId
            ? {
                ...member,
                assignedVessels: [...(member.assignedVessels || []), vesselId]
              }
            : member
        )
      );
    } catch (err) {
      setError('Erreur lors de l\'attribution du navire');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const value = {
    staff,
    loading,
    error,
    totalStaff: staff.length,
    addStaffMember,
    updateStaffMember,
    deleteStaffMember,
    assignVesselToStaff,
    clearError: () => setError(null)
  };

  return <StaffContext.Provider value={value}>{children}</StaffContext.Provider>;
}

export function useStaff() {
  const context = useContext(StaffContext);
  if (!context) {
    throw new Error('useStaff must be used within a StaffProvider');
  }
  return context;
}

// Hook personnalisé pour vérifier les permissions
export function useStaffPermissions(requiredPermission) {
  const { staff } = useStaff();
  const currentUserId = ''; // À remplacer par l'ID de l'utilisateur connecté

  const currentStaff = staff.find(member => member.id === currentUserId);
  const hasPermission = currentStaff?.permissions?.includes(requiredPermission) || 
                       currentStaff?.permissions?.includes('all');

  return {
    hasPermission,
    isLoading: !currentStaff,
    staff: currentStaff
  };
}