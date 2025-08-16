import React from 'react';
import { Navigate } from 'react-router-dom';
import routesName from 'src/routes/enum.routes';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const token = localStorage.getItem('admin_token');
  
  // Check if user is authenticated
  if (!token) {
    return <Navigate to={routesName.ADMIN_LOGIN} replace />;
  }

  // TODO: Add token validation logic here
  // For now, just check if token exists
  return <>{children}</>;
};

export default ProtectedRoute;