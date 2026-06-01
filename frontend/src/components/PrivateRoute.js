import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const PrivateRoute = ({ children, adminOnly = false }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Ako aplikacija još uvijek čita podatke, čekamo
  if (loading) {
    return (
      <div className="loading-center">
        <div className="spinner" />
        <p>Učitavanje...</p>
      </div>
    );
  }

  // Ako korisnik nije ulogovan, šaljemo ga na login
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Ako je stranica samo za admina, a korisnik nije admin, šaljemo ga na početnu
  if (adminOnly && user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return children;
};

export const GuestRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading-center">
        <div className="spinner" />
        <p>Učitavanje...</p>
      </div>
    );
  }

  // Ako je korisnik već ulogovan, šaljemo ga na početnu stranicu
  if (user) {
    return <Navigate to="/" replace />;
  }

  return children;
};