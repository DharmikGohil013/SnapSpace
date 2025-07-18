import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { getToken } from '../api/authApi';

const ProtectedRoute = () => {
  const token = getToken();
  return token ? <Outlet /> : <Navigate to="/" replace />;
};

export default ProtectedRoute;
