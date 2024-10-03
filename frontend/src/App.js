import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './components/auth/Dashboard';
import PrivateRoute from './components/auth/PrivateRoute';
import NavBar from './components/auth/Navbar';
import TopBar from './components/auth/Topbar';

function App() {
  return (
    <div style={{ display: 'flex' }}>
      <TopBar />
      <div style={{ marginTop: '64px', width: '100%' }}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <NavBar />
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route path="/" element={<Login />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
