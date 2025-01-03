import React, { useState } from 'react';

function ISMModule({ ismRecords, setISMRecords }) {
  const [formData, setFormData] = useState({
    ismEventType: "",
    ismDescription: "",
    ismAction: "",
    ismStatus: "pending",
    date: new Date().toISOString().slice(0, 16),
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newRecord = {
      id: Date.now(),
      ...formData,
    };

    setISMRecords((prev) => [...prev, newRecord]);

    // Reset form
    setFormData({
      ismEventType: "",
      ismDescription: "",
      ismAction: "",
      ismStatus: "pending",
      date: new Date().toISOString().slice(0, 16),
    });
  };

  const handleDelete = (id) => {
    setISMRecords((prev) => prev.filter((record) => record.id !== id));
  };

  return (
    <div className="space-y-8">
      {/* Form Section */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Add ISM Event</h2>
        </div>
        <div className="card-content">
          <form onSubmit={handleSubmit} className="form-grid">
            <div className="form-group">
              <label htmlFor="ismEventType">ISM Event Type</label>
              <select
                name="ismEventType"
                id="ismEventType"
                value={formData.ismEventType}
                onChange={handleChange}
                required
              >
                <option value="">Select Event Type</option>
                <option value="incident">Incident Report</option>
                <option value="nonConformity">Non-Conformity</option>
                <option value="observation">Observation</option>
                <option value="exercise">Exercise/Drill</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="ismDescription">Description</label>
              <textarea
                name="ismDescription"
                id="ismDescription"
                value={formData.ismDescription}
                onChange={handleChange}
                rows="4"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="ismAction">Corrective Action</label>
              <textarea
                name="ismAction"
                id="ismAction"
                value={formData.ismAction}
                onChange={handleChange}
                rows="3"
              />
            </div>

            <div className="form-group">
              <label htmlFor="ismStatus">Status</label>
              <select
                name="ismStatus"
                id="ismStatus"
                value={formData.ismStatus}
                onChange={handleChange}
                required
              >
                <option value="pending">Pending</option>
                <option value="resolved">Resolved</option>
                <option value="ongoing">Ongoing</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="date">Date</label>
              <input
                type="datetime-local"
                name="date"
                id="date"
                value={formData.date}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group flex justify-end space-x-4">
              <button
                type="button"
                onClick={() =>
                  setFormData({
                    ismEventType: "",
                    ismDescription: "",
                    ismAction: "",
                    ismStatus: "pending",
                    date: new Date().toISOString().slice(0, 16),
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
        </div>
      </div>

      {/* Records Section */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">ISM Event Records</h2>
        </div>
        <div className="card-content">
          <div className="table-container">
            <table className="records-table">
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Description</th>
                  <th>Corrective Action</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {ismRecords.map((record) => (
                  <tr key={record.id}>
                    <td>{record.ismEventType}</td>
                    <td>{record.ismDescription}</td>
                    <td>{record.ismAction}</td>
                    <td>{record.ismStatus}</td>
                    <td>{record.date}</td>
                    <td>
                      <button
                        onClick={() => handleDelete(record.id)}
                        className="button delete"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ISMModule;