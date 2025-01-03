export const STAFF_ROLES = {
  ADMIN_COMPANY: {
    label: 'Administrateur Entreprise',
    permissions: ['all']
  },
  FLEET_MANAGER: {
    label: 'Gestionnaire de Flotte',
    permissions: ['view_vessels', 'manage_vessels', 'manage_maintenance']
  },
  OPERATIONS_MANAGER: {
    label: 'Responsable Opérations',
    permissions: ['view_operations', 'manage_operations']
  },
  MAINTENANCE_STAFF: {
    label: 'Personnel Maintenance',
    permissions: ['view_maintenance', 'update_maintenance']
  },
  CREW_MEMBER: {
    label: 'Membre d\'Équipage',
    permissions: ['view_vessel_info', 'log_operations']
  }
};

export const PERMISSIONS = {
  view_vessels: 'Voir les navires',
  manage_vessels: 'Gérer les navires',
  manage_maintenance: 'Gérer la maintenance',
  view_operations: 'Voir les opérations',
  manage_operations: 'Gérer les opérations',
  view_maintenance: 'Voir la maintenance',
  update_maintenance: 'Mettre à jour la maintenance',
  view_vessel_info: 'Voir les informations navire',
  log_operations: 'Enregistrer les opérations',
  view_financial: 'Voir les données financières',
  manage_financial: 'Gérer les données financières',
  view_staff: 'Voir le personnel',
  manage_staff: 'Gérer le personnel',
  view_ism: 'Voir les données ISM',
  manage_ism: 'Gérer les données ISM'
};

export const getRolePermissions = (role) => {
  return STAFF_ROLES[role]?.permissions || [];
};

export const hasPermission = (userRole, permission) => {
  const permissions = getRolePermissions(userRole);
  return permissions.includes('all') || permissions.includes(permission);
};