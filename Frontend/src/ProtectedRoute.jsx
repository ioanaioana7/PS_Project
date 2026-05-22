import { Navigate } from 'react-router-dom';

/**
 * ProtectedRoute Component
 * Redirects to the login page if no user session is found in localStorage.
 */
const ProtectedRoute = ({ children }) => {
  const user = localStorage.getItem('user');
  
  if (!user) {
    // User is not authenticated, redirect to login
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
