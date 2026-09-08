import React, { useState } from 'react';
import axios from 'axios';

function BookAppointment() {
  // ➡️ ENHANCEMENT 2: Dynamic Select Blueprints instead of custom raw string entries
  const [doctorName, setDoctorName] = useState("Dr. Smith (General Practitioner)");
  const [date, setDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("09:00 AM");

  const doctorList = [
    "Dr. Smith (General Practitioner)",
    "Dr. Adams (Cardiology Specialist)",
    "Dr. Watson (Pediatrics Care)",
    "Dr. Davis (Neurology Department)"
  ];

  const availableSlots = ["09:00 AM", "10:00 AM", "11:00 AM", "01:00 PM", "02:00 PM", "03:00 PM"];

  const handleBooking = async (e) => {
    e.preventDefault();
    try {
      await axios.post("https://healthcare-management-portal-1.onrender.com/appointments/book", {
        patientId: "65f1234567890abcdef12345", 
        doctorName: doctorName,
        date: date,
        timeSlot: timeSlot
      });
      alert("Appointment booked successfully!");
      window.location.reload(); 
    } catch (err) {
      alert("Booking failed.");
    }
  };

  const styles = {
    card: { backgroundColor: '#ffffff', padding: '24px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', border: '1px solid #f3f4f6', fontFamily: 'sans-serif' },
    title: { fontSize: '18px', fontWeight: '600', color: '#1f2937', marginBottom: '16px' },
    label: { display: 'block', fontSize: '14px', fontWeight: '500', color: '#4b5563', marginBottom: '6px' },
    input: { width: '100%', padding: '10px 14px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box', marginBottom: '16px', outline: 'none', backgroundColor: '#fff' },
    btn: { width: '100%', backgroundColor: '#2563eb', color: '#ffffff', border: 'none', padding: '12px', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }
  };

  return (
    <div style={styles.card}>
      <h3 style={styles.title}>Schedule New Appointment</h3>
      <form onSubmit={handleBooking}>
        <div>
          <label style={styles.label}>Select Assigned Physician</label>
          <select value={doctorName} onChange={(e) => setDoctorName(e.target.value)} style={styles.input}>
            {doctorList.map((doc, idx) => (
              <option key={idx} value={doc}>{doc}</option>
            ))}
          </select>
        </div>
        <div>
          <label style={styles.label}>Appointment Date</label>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} style={styles.input} required />
        </div>
        <div>
          <label style={styles.label}>Select Time Slot</label>
          <select value={timeSlot} onChange={(e) => setTimeSlot(e.target.value)} style={styles.input}>
            {availableSlots.map((slot, idx) => (
              <option key={idx} value={slot}>{slot}</option>
            ))}
          </select>
        </div>
        <button type="submit" style={styles.btn}>Confirm Appointment</button>
      </form>
    </div>
  );
}

export default BookAppointment;