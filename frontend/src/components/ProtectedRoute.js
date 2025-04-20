import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './auth/AuthContext';

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated } = useAuth();
    const location = useLocation();

    if (!isAuthenticated && location.pathname !== "/home") {
        return <Navigate to="/home" state={{ from: location }} replace />;
    }

    return children;
};

export default ProtectedRoute;