import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ userRole, allowedRoles, children }) => {
  if (!userRole) return null; // Avoid rendering if userRole is undefined

  console.log("Current user role:", userRole);

  return allowedRoles.some(role => role.toLowerCase() === userRole.toLowerCase()) ? (
    children
  ) : (
    <Navigate to="/unauthorized" replace />
  );
};

export default ProtectedRoute;
