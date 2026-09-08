import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jsPDF } from 'jspdf';
// ➡️ 1. IMPORT CHART.JS COMPONENTS
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register Chart.js modules inside the engine configuration
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function Dashboard() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adminMode, setAdminMode] = useState(false);

  useEffect(() => {
    const fetchAppointments = async () => {
      setLoading(true);
      try {
        const endpoint = adminMode 
          ? "https://healthcare-management-portal.onrender.com/appointment/admin/all"
          : "https://healthcare-management-portal.onrender.com/appointments/list";

        const res = await axios.get(endpoint);
        setAppointments(res.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchAppointments();
  }, [adminMode]);

  // ➡️ 2. PROCESS LIVE DATABASE DATA FOR THE GRAPH
  const getChartData = () => {
    const doctorCounts = {};
    
    // Count how many appointments each unique doctor has inside the current state array
    appointments.forEach((app) => {
      const docName = app.doctorName || "Dr. Smith (General Practitioner)";
      doctorCounts[docName] = (doctorCounts[docName] || 0) + 1;
    });

    return {
      labels: Object.keys(doctorCounts),
      datasets: [
        {
          label: 'Number of Booked Appointments',
          data: Object.values(doctorCounts),
          backgroundColor: 'rgba(37, 99, 235, 0.6)', // Soft blue tint bars
          borderColor: 'rgb(37, 99, 235)',
          borderWidth: 1,
          borderRadius: 6,
        },
      ],
    };
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: true, text: 'Clinic Doctor Workload Breakdown', font: { size: 14, weight: 'bold' } },
    },
    scales: {
      y: { beginAtZero: true, ticks: { stepSize: 1 } }
    }
  };

  const downloadReceipt = (app) => {
    const doc = new jsPDF();
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.setTextColor(30, 58, 138); 
    doc.text("CarePortal Medical Center", 20, 30);

    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(107, 114, 128); 
    doc.text(`Generated Date: ${new Date().toLocaleDateString()}`, 20, 40);
    doc.line(20, 45, 190, 45); 

    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(17, 24, 39); 
    doc.text("Official Appointment Summary", 20, 58);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.text(`Physician Name:   ${app.doctorName || "Dr. Smith"}`, 20, 72);
    doc.text(`Scheduled Date:   ${new Date(app.date).toLocaleDateString()}`, 20, 82);
    doc.text(`Time Slot Group:   ${app.timeSlot || "09:00 AM"}`, 20, 92);
    doc.text(`Booking Status:    ${app.status || "confirmed"}`, 20, 102);
    doc.text(`Record Reference:  ${app._id}`, 20, 112);

    doc.line(20, 122, 190, 122);
    doc.setFontSize(9);
    doc.setTextColor(156, 163, 175);
    doc.text("This is an automated confirmation sheet. For medical queries, consult your provider.", 20, 132);

    doc.save(`Receipt-${app._id}.pdf`);
  };

  const handleCancel = async (id) => {
    if (window.confirm("Are you sure you want to cancel this appointment?")) {
      try {
        await axios.delete(`http://localhost:5000/appointments/cancel/${id}`);
        setAppointments(appointments.filter(app => app._id !== id));
      } catch (err) {
        alert("Failed to cancel.");
      }
    }
  };

  const getRowBackground = (timeSlot) => {
    if (!timeSlot) return '#ffffff';
    return timeSlot.includes('AM') ? '#f0fdfa' : '#f0f9ff';
  };

  const styles = {
    card: { backgroundColor: '#ffffff', padding: '24px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', border: '1px solid #f3f4f6', marginTop: '20px', fontFamily: 'sans-serif' },
    chartCard: { backgroundColor: '#ffffff', padding: '20px', borderRadius: '12px', border: '1px solid #e5e7eb', marginBottom: '24px', boxShadow: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.02)' },
    headerArea: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' },
    title: { fontSize: '18px', fontWeight: '600', color: '#1f2937', margin: 0 },
    toggleBtn: { padding: '6px 12px', fontSize: '12px', fontWeight: '600', borderRadius: '6px', border: '1px solid #d1d5db', cursor: 'pointer', backgroundColor: adminMode ? '#10b981' : '#fff', color: adminMode ? '#fff' : '#374151' },
    table: { width: '100%', textAlign: 'left', borderCollapse: 'collapse' },
    th: { padding: '12px 16px', backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb', fontSize: '12px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase' },
    td: { padding: '14px 16px', borderBottom: '1px solid #e5e7eb', fontSize: '14px', color: '#374151' },
    status: { display: 'inline-block', padding: '4px 10px', borderRadius: '9999px', fontSize: '12px', fontWeight: '600', backgroundColor: '#fef3c7', color: '#92400e', border: '1px solid #fde68a' },
    btnCancel: { backgroundColor: '#fef2f2', color: '#dc2626', border: '1px solid #fca5a5', fontSize: '12px', padding: '6px 12px', borderRadius: '8px', cursor: 'pointer', marginRight: '8px' },
    btnReceipt: { backgroundColor: '#eff6ff', color: '#2563eb', border: '1px solid #93c5fd', fontSize: '12px', padding: '6px 12px', borderRadius: '8px', cursor: 'pointer' }
  };

  return (
    <div style={styles.card}>
      <div style={styles.headerArea}>
        <h3 style={styles.title}>Your Active Bookings</h3>
        <button onClick={() => setAdminMode(!adminMode)} style={styles.toggleBtn}>
          {adminMode ? "✨ Admin Mode: ON" : "🔒 Switch to Admin View"}
        </button>
      </div>

      {/* ➡️ 3. NEW: CONDITIONAL CHART CARD VISUALIZATION FOR ADMIN MODE */}
      {adminMode && appointments.length > 0 && (
        <div style={styles.chartCard}>
          <Bar data={getChartData()} options={chartOptions} />
        </div>
      )}

      {loading ? (
        <p style={{ textAlign: 'center', color: '#6b7280' }}>Loading database entries...</p>
      ) : appointments.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#6b7280' }}>No active appointments found.</p>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Doctor</th>
                <th style={styles.th}>Date</th>
                <th style={styles.th}>Time Slot</th>
                <th style={{ ...styles.th, textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((app) => (
                <tr key={app._id} style={{ backgroundColor: getRowBackground(app.timeSlot) }}>
                  <td style={{ ...styles.td, fontWeight: '500' }}>{app.doctorName}</td>
                  <td style={styles.td}>{new Date(app.date).toLocaleDateString()}</td>
                  <td style={styles.td}>
                    <span style={styles.status}>{app.timeSlot}</span>
                  </td>
                  <td style={{ ...styles.td, textAlign: 'center' }}>
                    <button onClick={() => handleCancel(app._id)} style={styles.btnCancel}>Cancel</button>
                    <button onClick={() => downloadReceipt(app)} style={styles.btnReceipt}>Receipt</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Dashboard;