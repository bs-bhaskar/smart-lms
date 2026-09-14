import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AdminRoute() {
  const { user, role, loading } = useAuth();
  if (loading) return null;
  return user && role === 'admin' ? <Outlet /> : <Navigate to="/login" replace />;
} 