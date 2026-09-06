import React, { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode"; // ➡️ NEW: Import to read token values
import Login from "./pages/Login";
import Register from "./pages/Register";
import BookAppointment from "./components/BookAppointment";
import Dashboard from "./components/Dashboard";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [userName, setUserName] = useState(""); // ➡️ NEW: User name state holder

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
      try {
        // ➡️ NEW: Extract user details safely out of the browser JWT memory
        const decoded = jwtDecode(token);
        // Fallback placeholder if custom backend sign keys lack explicit name attributes
        setUserName(decoded.name || "Patient"); 
      } catch (err) {
        console.error("Token decode parsing failed:", err);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    window.location.reload();
  };

  const shellStyles = {
    wrapper: { minHeight: '100vh', backgroundColor: '#f9fafb', padding: '32px 16px', fontFamily: 'sans-serif' },
    container: { maxWidth: '600px', margin: '0 auto' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e5e7eb', paddingBottom: '16px', marginBottom: '24px' },
    brand: { fontSize: '24px', fontWeight: '700', color: '#111827', margin: 0 },
    welcome: { fontSize: '15px', color: '#4b5563', marginTop: '4px' }, // ➡️ NEW style tag
    logoutBtn: { backgroundColor: '#fef2f2', color: '#dc2626', border: '1px solid #fca5a5', padding: '6px 12px', borderRadius: '8px', cursor: 'pointer', fontWeight: '500' }
  };

  if (!isLoggedIn) {
    return showRegister ? (
      <Register toggleAuth={() => setShowRegister(false)} />
    ) : (
      <Login toggleAuth={() => setShowRegister(true)} />
    );
  }

  return (
    <div style={shellStyles.wrapper}>
      <div style={shellStyles.container}>
        <header style={shellStyles.header}>
          <div>
            <h2 style={shellStyles.brand}>CarePortal</h2>
            {/* ➡️ NEW: Dynamic Welcome Greeting Element injected here */}
            <p style={shellStyles.welcome}>Welcome back, <strong style={{ color: '#2563eb' }}>{userName}</strong>! 👋</p>
          </div>
          <button onClick={handleLogout} style={shellStyles.logoutBtn}>Logout</button>
        </header>
        
        <main style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <BookAppointment />
          <Dashboard />
        </main>
      </div>
    </div>
  );
}

export default App;