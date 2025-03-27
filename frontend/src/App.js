// src/App.js
import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import CreateProfile from "./components/CreateProfile";
import UserProfile from "./components/UserProfile";
import OrganizerProfile from "./services/OrganizerProfile";
import FindEvent from "./components/FindEvent";
import Register from "./services/auth/Register";
import Login from "./services/auth/Login";
import Header from "./components/Header"; // Импортируем компонент Header
import { useAuth } from './services/auth/AuthContext'; // Импортируем useAuth
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from "./components/HomePage"; // Импортируем ProtectedRoute

const App = () => {
    const { isAuthenticated } = useAuth();
    const location = useLocation();

    // Список маршрутов, где не нужно отображать Header
    const routesWithoutHeader = ['/login', '/register'];

    // Проверяем, нужно ли отображать Header
    const shouldShowHeader = !routesWithoutHeader.includes(location.pathname);

    return (
        <div className="App">
            {shouldShowHeader && <Header />} {/* Условное отображение Header */}
            <Routes>
                <Route path="/homepage" element={<HomePage />} /> {/* Добавляем маршрут для домашней страницы */}
                <Route path="/create-profile" element={<ProtectedRoute><CreateProfile /></ProtectedRoute>} />
                <Route path="/profile/:username" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} /> {/* Маршрут для страницы профиля */}
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/organizer-profile" element={<ProtectedRoute><OrganizerProfile /></ProtectedRoute>} />
                <Route path="*" element={<Navigate to="/homepage" />} />
                <Route path="/find-event" element={<ProtectedRoute><FindEvent /></ProtectedRoute>} />
            </Routes>
        </div>
    );
};

export default App;