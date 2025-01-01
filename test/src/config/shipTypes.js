// config/shipTypes.js
export const shipTypes = [
    { value: 'tanker', label: 'Tanker' },
    { value: 'container', label: 'Container Ship' },
    { value: 'bulkCarrier', label: 'Bulk Carrier' },
  ];
  
  export const shipTypeConfigurations = {
    tanker: {
      equipment: [
        'Cargo Pumps',
        'Inert Gas System',
        'COW System',
        'Heating System',
        'Main Engine',
        'Auxiliary Engine',
        'Generator',
      ],
      activities: [
        'Cargo Operation',
        'Tank Cleaning',
        'Inerting',
        'Bunkering',
        'Maintenance',
        'Safety Rounds',
      ],
    },
    container: {
      equipment: [
        'Container Crane',
        'Reefer System',
        'Lashing Equipment',
        'Main Engine',
        'Auxiliary Engine',
        'Generator',
      ],
      activities: [
        'Container Loading',
        'Container Unloading',
        'Reefer Monitoring',
        'Lashing Operation',
        'Maintenance',
      ],
    },
    bulkCarrier: {
      equipment: [
        'Cargo Crane',
        'Ventilation System',
        'Conveyor System',
        'Main Engine',
        'Auxiliary Engine',
        'Generator',
      ],
      activities: [
        'Bulk Loading',
        'Bulk Discharging',
        'Hold Cleaning',
        'Ventilation',
        'Maintenance',
      ],
    },
  };