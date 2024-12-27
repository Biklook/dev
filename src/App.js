import React, { useState, useEffect, useMemo } from "react";
import { Navigation, Anchor, Ship, RotateCw, Tool, AlertTriangle } from "lucide-react";
import "./styles.css";

// Define Card components
const Card = ({ children }) => <div className="card">{children}</div>;
const CardHeader = ({ children }) => <div className="card-header">{children}</div>;
const CardTitle = ({ children }) => <h2 className="card-title">{children}</h2>;
const CardContent = ({ children }) => <div className="card-content">{children}</div>;

// Configuration de maintenance par type d'équipement
const maintenanceSchedule = {
  'Main Engine': {
    inspectionHours: 2000,
    minorServiceHours: 5000,
    majorServiceHours: 10000
  },
  'Auxiliary Engine': {
    inspectionHours: 1500,
    minorServiceHours: 4000,
    majorServiceHours: 8000
  },
  'Pump': {
    inspectionHours: 1000,
    minorServiceHours: 3000,
    majorServiceHours: 6000
  },
  'Compressor': {
    inspectionHours: 800,
    minorServiceHours: 2500,
    majorServiceHours: 5000
  }
};

// Liste des équipements disponibles
const availableEquipment = [
  'Main Engine',
  'Auxiliary Engine',
  'Pump',
  'Compressor',
  'Other'
];

export default function App() {
  const [formData, setFormData] = useState({
    shipName: "",
    shipType: "",
    status: "navigation",
    activity: "",
    equipmentName: "",
    workingStartTime: "",
    workingStopTime: "",
    remarks: "",
  });

  const [records, setRecords] = useState([]);
  const [equipmentHours, setEquipmentHours] = useState({});
  const [maintenanceAlerts, setMaintenanceAlerts] = useState([]);

  // Set default icon for vessel statuses
  const vesselStatus = {
    navigation: { icon: <Navigation className="icon" /> },
    anchorage: { icon: <Anchor className="icon" /> },
    drifting: { icon: <Ship className="icon" /> },
    inPort: { icon: <Ship className="icon" /> },
    maneuvering: { icon: <RotateCw className="icon" /> },
  };

  // Define the available activities
  const activities = ["Idle", "Loading", "Discharging", "Bunkering", "Supply"];

  // Calculer les heures de travail
  const calculateWorkingHours = (startTime, stopTime) => {
    const start = new Date(startTime);
    const stop = new Date(stopTime);
    return (stop - start) / (1000 * 60 * 60); // Convertir en heures
  };

  // Mettre à jour les heures de l'équipement
  const updateEquipmentHours = (equipmentName, hours) => {
    setEquipmentHours(prev => ({
      ...prev,
      [equipmentName]: (prev[equipmentName] || 0) + hours
    }));
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
        priority: 'high'
      });
    } else if (totalHours >= schedule.minorServiceHours) {
      alerts.push({
        type: 'minor',
        message: `Maintenance mineure requise pour ${equipmentName} (${totalHours.toFixed(1)} heures)`,
        priority: 'medium'
      });
    } else if (totalHours >= schedule.inspectionHours) {
      alerts.push({
        type: 'inspection',
        message: `Inspection requise pour ${equipmentName} (${totalHours.toFixed(1)} heures)`,
        priority: 'low'
      });
    }
    return alerts;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      new Date(formData.workingStopTime) <= new Date(formData.workingStartTime)
    ) {
      alert("Stop time must be later than start time.");
      return;
    }

    // Calculer les heures de travail
    const workingHours = calculateWorkingHours(
      formData.workingStartTime,
      formData.workingStopTime
    );

    // Mettre à jour les heures de l'équipement
    updateEquipmentHours(formData.equipmentName, workingHours);

    const newRecord = {
      id: Date.now(),
      ...formData,
      workingHours,
      dateAdded: new Date().toLocaleString(),
    };

    setRecords([...records, newRecord]);

    // Vérifier la maintenance après mise à jour
    const totalHours = equipmentHours[formData.equipmentName] + workingHours;
    const maintenanceNeeded = checkMaintenance(formData.equipmentName, totalHours);
    
    if (maintenanceNeeded.length > 0) {
      setMaintenanceAlerts(prev => [...prev, ...maintenanceNeeded]);
    }

    // Clear form after submission
    setFormData({
      shipName: "",
      shipType: "",
      status: "navigation",
      activity: "",
      equipmentName: "",
      workingStartTime: "",
      workingStopTime: "",
      remarks: "",
    });
  };

  // Handle changes in form inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Delete record
  const handleDelete = (id) => {
    const recordToDelete = records.find(record => record.id === id);
    if (recordToDelete) {
      // Soustraire les heures de l'équipement supprimé
      setEquipmentHours(prev => ({
        ...prev,
        [recordToDelete.equipmentName]: Math.max(0, (prev[recordToDelete.equipmentName] || 0) - recordToDelete.workingHours)
      }));
    }
    setRecords(records.filter((record) => record.id !== id));
  };

  // Store and retrieve records from localStorage
  useEffect(() => {
    const storedRecords = JSON.parse(localStorage.getItem("records"));
    const storedHours = JSON.parse(localStorage.getItem("equipmentHours"));
    const storedAlerts = JSON.parse(localStorage.getItem("maintenanceAlerts"));
    
    if (storedRecords) setRecords(storedRecords);
    if (storedHours) setEquipmentHours(storedHours);
    if (storedAlerts) setMaintenanceAlerts(storedAlerts);
  }, []);

  useEffect(() => {
    localStorage.setItem("records", JSON.stringify(records));
    localStorage.setItem("equipmentHours", JSON.stringify(equipmentHours));
    localStorage.setItem("maintenanceAlerts", JSON.stringify(maintenanceAlerts));
  }, [records, equipmentHours, maintenanceAlerts]);

  // Use memoization to optimize rendering of records
  const renderedRecords = useMemo(
    () =>
      records.map((record) => (
        <tr key={record.id}>
          <td>{record.shipName}</td>
          <td>{record.shipType}</td>
          <td>{record.status}</td>
          <td>{record.activity}</td>
          <td>{record.equipmentName}</td>
          <td>{new Date(record.workingStartTime).toLocaleString()}</td>
          <td>{new Date(record.workingStopTime).toLocaleString()}</td>
          <td>{record.workingHours.toFixed(1)} heures</td>
          <td>{record.remarks}</td>
          <td>
            <button
              onClick={() => handleDelete(record.id)}
              className="button delete-button"
              aria-label="Delete record"
            >
              Delete
            </button>
          </td>
        </tr>
      )),
    [records]
  );

  return (
    <div className="app-container">
      <Card>
        <CardHeader>
          <CardTitle>
            {vesselStatus[formData.status]?.icon}
            Chief Engineer Data Entry
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="form">
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="shipName">Ship Name</label>
                <input
                  type="text"
                  name="shipName"
                  id="shipName"
                  value={formData.shipName}
                  onChange={handleChange}
                  required
                  aria-label="Ship Name"
                />
              </div>

              <div className="form-group">
                <label htmlFor="shipType">Ship Type</label>
                <select
                  name="shipType"
                  id="shipType"
                  value={formData.shipType}
                  onChange={handleChange}
                  required
                  aria-label="Ship Type"
                >
                  <option value="">Select ship type</option>
                  <option value="cargo">Cargo</option>
                  <option value="tanker">Tanker</option>
                  <option value="passenger">Passenger</option>
                  <option value="tugboat">Tugboat</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="status">Status</label>
                <select
                  name="status"
                  id="status"
                  value={formData.status}
                  onChange={handleChange}
                  required
                  aria-label="Status"
                >
                  <option value="navigation">Navigation</option>
                  <option value="anchorage">Anchorage</option>
                  <option value="drifting">Drifting</option>
                  <option value="inPort">In Port</option>
                  <option value="maneuvering">Maneuvering</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="activity">Activity</label>
                <select
                  name="activity"
                  id="activity"
                  value={formData.activity}
                  onChange={handleChange}
                  required
                  aria-label="Activity"
                >
                  <option value="">Select activity</option>
                  {activities.map((activity) => (
                    <option key={activity} value={activity}>
                      {activity}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="equipmentName">Equipment Name</label>
                <select
                  name="equipmentName"
                  id="equipmentName"
                  value={formData.equipmentName}
                  onChange={handleChange}
                  required
                  aria-label="Equipment Name"
                >
                  <option value="">Select equipment</option>
                  {availableEquipment.map((equipment) => (
                    <option key={equipment} value={equipment}>
                      {equipment}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="workingStartTime">Working Start Time</label>
                <input
                  type="datetime-local"
                  name="workingStartTime"
                  id="workingStartTime"
                  value={formData.workingStartTime}
                  onChange={handleChange}
                  required
                  aria-label="Working Start Time"
                />
              </div>

              <div className="form-group">
                <label htmlFor="workingStopTime">Working Stop Time</label>
                <input
                  type="datetime-local"
                  name="workingStopTime"
                  id="workingStopTime"
                  value={formData.workingStopTime}
                  onChange={handleChange}
                  required
                  aria-label="Working Stop Time"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="remarks">Remarks</label>
              <textarea
                name="remarks"
                id="remarks"
                value={formData.remarks}
                onChange={handleChange}
                rows="3"
                aria-label="Remarks"
              ></textarea>
            </div>

            <div className="button-group">
              <button
                type="button"
                onClick={() =>
                  setFormData({
                    shipName: "",
                    shipType: "",
                    status: "navigation",
                    activity: "",
                    equipmentName: "",
                    workingStartTime: "",
                    workingStopTime: "",
                    remarks: "",
                  })
                }
                className="button secondary"
              >
                Clear
              </button>
              <button type="submit" className="button primary">
                Submit
              </button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            <Tool className="icon" />
            Equipment Maintenance Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="maintenance-grid">
            {Object.entries(equipmentHours).map(([equipment, hours]) => (
              <div key={equipment} className="maintenance-item">
                <h3>{equipment}</h3>
                <p>Total Hours: {hours.toFixed(1)}</p>
                {maintenanceSchedule[equipment] && (
                  <div className="maintenance-progress">
                    <div className="progress-bar">
                      <div
                        className="progress-fill"
                        style={{
                          width: `${Math.min(
                            (hours / maintenanceSchedule[equipment].majorServiceHours) * 100,
                            100
                          )}%`
                        }}
                      ></div>
                    </div>
                    <p>Next major service: {maintenanceSchedule[equipment].majorServiceHours} hours</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {maintenanceAlerts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>
              <AlertTriangle className="icon" />
              Maintenance Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="alerts-container"></div>
            <div className="alerts-container">
              {maintenanceAlerts.map((alert, index) => (
                <div key={index} className={`alert ${alert.priority}`}>
                  {alert.message}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Records</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="table-container">
            <table className="records-table">
              <thead>
                <tr>
                  <th>Ship Name</th>
                  <th>Ship Type</th>
                  <th>Status</th>
                  <th>Activity</th>
                  <th>Equipment</th>
                  <th>Start Time</th>
                  <th>Stop Time</th>
                  <th>Working Hours</th>
                  <th>Remarks</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>{renderedRecords}</tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}