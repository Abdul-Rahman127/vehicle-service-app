import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';

// Import pages
import Home from './pages/Home';
import Services from './pages/Services';
import HowItWorks from './pages/HowItWorks';
import Contact from './pages/Contact';
import Booking from './pages/Booking';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import AdminBookings from './pages/AdminBookings';
import AdminPending from './pages/AdminPending';
import AdminCompleted from './pages/AdminCompleted';
import AdminServices from './pages/AdminServices';
import AdminReports from './pages/AdminReports';
import AdminSettings from './pages/AdminSettings';
import AdminContactMessages from './pages/AdminContactMessages';

// Protected Route component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useApp();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

function AppContent() {
  return (
    <Router>
      <Routes>
        {/* Customer Frontend Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/services" element={<Services />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/booking" element={<Booking />} />
        <Route path="/login" element={<Login />} />

        {/* Protected Admin Routes */}
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/bookings" 
          element={
            <ProtectedRoute>
              <AdminBookings />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/pending" 
          element={
            <ProtectedRoute>
              <AdminPending />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/completed" 
          element={
            <ProtectedRoute>
              <AdminCompleted />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/services" 
          element={
            <ProtectedRoute>
              <AdminServices />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/reports" 
          element={
            <ProtectedRoute>
              <AdminReports />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/messages" 
          element={
            <ProtectedRoute>
              <AdminContactMessages />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/settings" 
          element={
            <ProtectedRoute>
              <AdminSettings />
            </ProtectedRoute>
          } 
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
