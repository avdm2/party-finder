import React, { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [role, setRole] = useState('');

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            console.log("USER IS AUTH")
            setIsAuthenticated(true);
            const payload = JSON.parse(atob(token.split(".")[1]));
            setRole(payload.roles[0]);
        }
    }, []);

    const login = (token) => {
        localStorage.setItem("token", token);
        setIsAuthenticated(true);
        const payload = JSON.parse(atob(token.split(".")[1]));
        setRole(payload.roles[0]);
    };

    const logout = () => {
        localStorage.removeItem("token");
        setIsAuthenticated(false);
        setRole('');
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, role, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};