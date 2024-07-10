import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './pages/Dashboard';
import api from './services/api';

function App() {
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const response = await api.get('/auth/check-token');
        if (response.status === 200) {
          setAuthenticated(true);
        }
      } catch (error) {
        console.error('Token check failed', error);
        setAuthenticated(false);
      }
    };

    checkAuth();
  }, []);

  return (
    <Routes>
      <Route path="/login" element={<Login setAuthenticated={setAuthenticated} />} />
      <Route path="/signup" element={<Register />} />
      <Route path="/dashboard" element={authenticated ? <Dashboard /> : <Navigate to="/login" />} />
      <Route path="/" element={<Navigate to="/login" />} />
    </Routes>
  );
}

export default App;
