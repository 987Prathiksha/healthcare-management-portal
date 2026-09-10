import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Dashboard() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adminMode, setAdminMode] = useState(false);

  // ✅ Unified API base URL
  const BACKEND_URL = "http://localhost:5000/appointments";

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        const userId = localStorage.getItem("userId") || "65f1234567890abcdef12345";

        // ✅ Consistent routes with backend
        const endpoint = adminMode 
          ? `${BACKEND_URL}/admin/all`
          : `${BACKEND_URL}/list/${userId}`;

        console.log("Fetching dashboard data from:", endpoint);

        const res = await axios.get(endpoint);
        setAppointments(res.data);
      } catch (err) {
        console.error("API Error Response: ", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [adminMode]);

  const handleCancel = async (appointmentId) => {
    try {
      // ✅ Cancel route aligned with backend
      await axios.delete(`${BACKEND_URL}/cancel/${appointmentId}`);
      alert("Appointment canceled successfully!");
      setAppointments(appointments.filter(app => app._id !== appointmentId));
    } catch (err) {
      console.error("Error canceling appointment:", err);
      alert("Failed to cancel appointment.");
    }
  };

  const styles = {
    container: { fontFamily: 'sans-serif', padding: '24px', backgroundColor: '#f9fafb', minHeight: '100vh' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' },
    title: { fontSize: '24px', fontWeight: 'bold', color: '#111827' },
    toggleBtn: { backgroundColor: '#4b5563', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' },
    card: { backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e5e7eb', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' },
    loadingText: { fontSize: '16px', color: '#6b7280', textAlign: 'center', padding: '40px 0' },
    emptyText: { fontSize: '16px', color: '#6b7280', textAlign: 'center', padding: '20px 0' },
    table: { width: '100%', borderCollapse: 'collapse', textAlign: 'left' },
    th: { padding: '12px', borderBottom: '2px solid #e5e7eb', color: '#374151', fontWeight: '600' },
    td: { padding: '12px', borderBottom: '1px solid #e5e7eb', color: '#4b5563' },
    cancelBtn: { backgroundColor: '#ef4444', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '13px' }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>{adminMode ? "Admin Management Dashboard" : "Patient Dashboard"}</h2>
        <button 
          style={styles.toggleBtn} 
          onClick={() => setAdminMode(!adminMode)}
        >
          Switch to {adminMode ? "Patient View" : "Admin View"}
        </button>
      </div>

      <div style={styles.card}>
        {loading ? (
          <div style={styles.loadingText}>Loading database entries...</div>
        ) : appointments.length === 0 ? (
          <div style={styles.emptyText}>No appointments found.</div>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Physician</th>
                <th style={styles.th}>Date</th>
                <th style={styles.th}>Time Slot</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((app) => (
                <tr key={app._id}>
                  <td style={styles.td}>{app.doctorName || "General Practitioner"}</td>
                  <td style={styles.td}>{new Date(app.date).toLocaleDateString()}</td>
                  <td style={styles.td}>{app.timeSlot}</td>
                  <td style={styles.td}>
                    <span style={{ color: app.status === 'booked' ? '#10b981' : '#f59e0b', fontWeight: 'bold' }}>
                      {app.status}
                    </span>
                  </td>
                  <td style={styles.td}>
                    <button style={styles.cancelBtn} onClick={() => handleCancel(app._id)}>
                      Cancel
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}


export default Dashboard;
