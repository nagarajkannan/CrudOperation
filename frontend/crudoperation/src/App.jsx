import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import AdminDashboard from './components/AdminDashboard';
import UserDashboard from './components/UserDashboard';
import Navbar from './components/Navbar';
import { getCurrentUser } from './utils/Auth';

function App() {
  const [user, setUser] = useState(getCurrentUser());

  useEffect(() => {
    setUser(getCurrentUser());
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <BrowserRouter>
      <Navbar user={user} onLogout={handleLogout} />
      <div style={{ padding: 20 }}>
        <Routes>
          <Route path="/" element={user ? (
            user.role === 'admin' ? <Navigate to="/admin" /> : <Navigate to="/dashboard" />
          ) : <Navigate to="/login" />} />

          <Route path="/register" element={<Register onAuth={() => setUser(getCurrentUser())} />} />
          <Route path="/login" element={<Login onAuth={() => setUser(getCurrentUser())} />} />

        
          <Route path="/admin" element={user && user.role === 'admin' ? <AdminDashboard /> : <Navigate to="/login" />} />

          
          <Route path="/dashboard" element={user ? <UserDashboard /> : <Navigate to="/login" />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
