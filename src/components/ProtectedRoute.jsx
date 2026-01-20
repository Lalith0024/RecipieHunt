import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';

const ProtectedRoute = ({ children }) => {
  const { user, initializing } = useAuth();
  const location = useLocation();

  if (initializing) {
    return (
      <div aria-busy="true" aria-live="polite" style={{ padding: '2rem' }}>
        <div className="skeleton" style={{ height: 24, background: '#eee', marginBottom: 12 }}></div>
        <div className="skeleton" style={{ height: 24, background: '#eee', width: '80%' }}></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  return children;
};

export default ProtectedRoute;


