import React from 'react';
import { Navigate, Outlet } from 'react-router';

export const ProtectedRoute = ({ isAuthenticated }) => {
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <Outlet />;
};

export const AdminGuard = ({ isAuthenticated, user }) => {
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (user?.role !== "admin") return <Navigate to="/" replace />;
  return <Outlet />;
};

export const PublicRoute = ({ isAuthenticated }) => {
  if (isAuthenticated) return <Navigate to="/" replace />;
  return <Outlet />;
};