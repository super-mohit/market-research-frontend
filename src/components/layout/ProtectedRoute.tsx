import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';

export const ProtectedRoute = () => {
  const token = useAuthStore((state) => state.token);

  if (!token) {
    // User not authenticated, redirect to login page
    return <Navigate to="/login" />;
  }

  // User is authenticated, render the child routes
  return <Outlet />;
}; 