import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../services/auth';
import { useFeedback } from '../../services/feedback';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const { showFeedback } = useFeedback();

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (!user) {
    showFeedback('Please login to access this page', 'info');
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;