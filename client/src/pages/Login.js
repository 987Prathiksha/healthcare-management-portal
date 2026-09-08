import React, { useState } from 'react';
import axios from 'axios';

// ➡️ FIXED: Accepting the toggleAuth property from App.js on line 4
function Login({ toggleAuth }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
const login = async () => {
    try {
        const res = await axios.post("https://onrender.com/auth/login", { email, password });
        
        // 1. SAVE THE SECURITY TOKEN (Crucial for page loads)
        localStorage.setItem("token", res.data.token);

        // 2. USE OPTIONAL CHAINING (?.) TO SAFELY CAPTURE THE ID WITHOUT CRASHING
        const verifiedId = res.data.user?._id || res.data.userId || res.data._id;
        localStorage.setItem("userId", verifiedId);

        alert("Login successful!");
        
        // 3. TRIGGER REDIRECT
        window.location.href = "/dashboard"; 
        
    } catch (err) {
      console.error(err);
      alert("Invalid credentials. Please try again.");
    }
  };

  const styles = {
    container: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f3f4f6', fontFamily: 'sans-serif' },
    card: { backgroundColor: '#ffffff', padding: '32px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', width: '100%', maxWidth: '400px', boxSizing: 'border-box' },
    title: { fontSize: '24px', fontWeight: '700', color: '#111827', textAlign: 'center', marginBottom: '24px' },
    label: { display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' },
    input: { width: '100%', padding: '10px 14px', border: '1px solid #d1d5db', borderRadius: '8px', marginBottom: '16px', boxSizing: 'border-box', outline: 'none' },
    btn: { width: '100%', backgroundColor: '#2563eb', color: '#ffffff', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', transition: 'background-color 0.2s' },
    toggleText: { textAlign: 'center', marginTop: '16px', fontSize: '14px', color: '#4b5563' },
    link: { color: '#2563eb', cursor: 'pointer', textDecoration: 'underline', fontWeight: '500' }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Account Login</h2>
        <form onSubmit={(e) => { e.preventDefault(); login(); }}>
          <label style={styles.label}>Email Address</label>
          <input type="email" onChange={(e) => setEmail(e.target.value)} style={styles.input} required />
          
          <label style={styles.label}>Password</label>
          <input type="password" onChange={(e) => setPassword(e.target.value)} style={styles.input} required />
          
          <button type="submit" style={styles.btn}>Log In</button>
        </form>
        
        {/* ➡️ NEW: This link triggers the toggle function to reveal the signup form */}
        <p style={styles.toggleText}>
          Don't have an account? <span style={styles.link} onClick={toggleAuth}>Sign up here</span>
        </p>
      </div>
    </div>
  );
}

export default Login;