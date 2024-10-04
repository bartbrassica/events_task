import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './components/auth/Dashboard';
import EventDetails from './components/auth/EventDetails';
import PrivateRoute from './components/auth/PrivateRoute';
import NavBar from './components/auth/Navbar';
import TopBar from './components/auth/Topbar';
import Participants from './components/auth/Participants';

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
          <Route
            path="/events/:eventId"
            element={
              <PrivateRoute>
                <NavBar />
                <EventDetails />
              </PrivateRoute>
            }
          />
          <Route
            path="/participants"
            element={
              <PrivateRoute>
                <NavBar />
                <Participants />
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
