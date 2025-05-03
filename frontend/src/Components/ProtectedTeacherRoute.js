import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedTeacherRoute = ({ children }) => {
  // Check if all required items exist in localStorage
  const isAuthenticated = ['teacher_token', 'FirstName', 'LastName', 'Email'].every((key) =>
    localStorage.getItem(key)
  );

  // Redirect to the login page if not authenticated
  if (!isAuthenticated) {
    console.error('Authentication failed. Missing required data.');
    return <Navigate to="/" replace />;
  }

  // Render the protected component if authenticated
  return children;
};

export default ProtectedTeacherRoute;