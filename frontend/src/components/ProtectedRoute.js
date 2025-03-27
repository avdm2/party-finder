import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../services/auth/AuthContext'; // Импортируем useAuth

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated } = useAuth();
    const location = useLocation();

    if (!isAuthenticated) {
        return <Navigate to="/homepage" state={{ from: location }} replace />;
    }

    return children;
};

export default ProtectedRoute;