import React, { useState } from 'react';
import axios from 'axios';

function Register({ toggleAuth }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  // ➡️ NEW STATE: Tracks current password strength level
  const [strength, setStrength] = useState({ label: "", color: "#9ca3af", width: "0%" });

  // Configured exclusively for local execution environment
  const BACKEND_URL = "http://localhost:5000";

  // ➡️ NEW FUNCTION: Evaluates password text strength dynamically
  const checkPasswordStrength = (pass) => {
    setPassword(pass);
    if (pass.length === 0) {
      setStrength({ label: "", color: "#9ca3af", width: "0%" });
      return;
    }
    if (pass.length < 6) {
      setStrength({ label: "Too Short 🟥", color: "#dc2626", width: "30%" });
      return;
    }
    
    // Check for an uppercase letter and a number
    const hasUppercase = /[A-Z]/.test(pass);
    const hasNumber = /[0-9]/.test(pass);

    if (pass.length >= 8 && hasUppercase && hasNumber) {
      setStrength({ label: "Strong Password 🟩", color: "#10b981", width: "100%" });
    } else {
      setStrength({ label: "Weak (Add Upper/Number) 🟨", color: "#f59e0b", width: "65%" });
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (password.length < 6) {
      alert("Password must be at least 6 characters long!");
      return;
    }
    try {
      // Redirected registration endpoint cleanly to localhost routes
      await axios.post(`${BACKEND_URL}/auth/register`, { name, email, password, role: "patient" });
      alert("Registration successful! Please log in.");
      toggleAuth(); 
    } catch (err) {
      alert("Registration failed. Email might already exist.");
    }
  };

  const styles = {
    container: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f3f4f6', fontFamily: 'sans-serif' },
    card: { backgroundColor: '#ffffff', padding: '32px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', width: '100%', maxWidth: '400px', boxSizing: 'border-box' },
    title: { fontSize: '24px', fontWeight: '700', color: '#111827', textAlign: 'center', marginBottom: '24px' },
    label: { display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' },
    input: { width: '100%', padding: '10px 14px', border: '1px solid #d1d5db', borderRadius: '8px', marginBottom: '16px', boxSizing: 'border-box', outline: 'none' },
    btn: { width: '100%', backgroundColor: '#059669', color: '#ffffff', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', fontSize: '14px', transition: 'background-color 0.2s' },
    toggleText: { textAlign: 'center', marginTop: '16px', fontSize: '14px', color: '#4b5563' },
    link: { color: '#2563eb', cursor: 'pointer', textDecoration: 'underline', fontWeight: '500' },
    
    // ➡️ Strength Meter Styling Rules
    meterContainer: { width: '100%', backgroundColor: '#e5e7eb', height: '6px', borderRadius: '9999px', marginBottom: '6px', overflow: 'hidden' },
    meterBar: { height: '100%', backgroundColor: strength.color, width: strength.width, transition: 'width 0.3s ease, background-color 0.3s ease' },
    meterLabel: { fontSize: '12px', fontWeight: '600', color: strength.color, marginBottom: '16px', display: 'block' }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Create Account</h2>
        <form onSubmit={handleRegister}>
          <label style={styles.label}>Full Name</label>
          <input type="text" onChange={(e) => setName(e.target.value)} style={styles.input} required />
          
          <label style={styles.label}>Email Address</label>
          <input type="email" onChange={(e) => setEmail(e.target.value)} style={styles.input} required />
          
          <label style={styles.label}>Password</label>
          <input 
            type="password" 
            value={password}
            onChange={(e) => checkPasswordStrength(e.target.value)} 
            style={styles.input} 
            required 
          />
          
          {/* ➡️ Interactive Strength UI Banner Module */}
          {password.length > 0 && (
            <div>
              <div style={styles.meterContainer}>
                <div style={styles.meterBar}></div>
              </div>
              <span style={styles.meterLabel}>{strength.label}</span>
            </div>
          )}
          
          <button type="submit" style={styles.btn} onMouseOver={(e) => e.target.style.backgroundColor = '#047857'} onMouseOut={(e) => e.target.style.backgroundColor = '#059669'}>Sign Up</button>
        </form>
        <p style={styles.toggleText}>
          Already have an account? <span style={styles.link} onClick={toggleAuth}>Log in here</span>
        </p>
      </div>
    </div>
  );
}

export default Register;