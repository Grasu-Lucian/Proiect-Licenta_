import { Navigate } from 'react-router-dom';

const ProtectedStudentRoute = ({ children }) => {
  // Check if all required items exist in localStorage
  const isAuthenticated = ['student_token', 'FirstName', 'LastName', 'Email'].every((key) =>
    localStorage.getItem(key)
  );

  // Redirect to the login page if not authenticated
  if (!isAuthenticated) {
    console.error('Authentication failed. Missing required data.');
    return <Navigate to="/login/student" replace />;
  }

  // Render the protected component if authenticated
  return children;
};

export default ProtectedStudentRoute;