import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function TeacherRoute() {
  const { user, role, loading } = useAuth();
  if (loading) return null;
  return user && role === 'teacher' ? <Outlet /> : <Navigate to="/login" replace />;
} 