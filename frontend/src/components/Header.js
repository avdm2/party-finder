// src/components/Header.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../services/auth/AuthContext'; // Импортируем useAuth
import '../styles/Header.css'; // Импортируем стили

const Header = () => {
    const { isAuthenticated, role, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/homepage');
    };

    const profilePath = role === 'ORGANIZER' ? '/organizer-profile' : '/profile/me';
    const eventsHandle = role === 'ORGANIZER' ? '/' : '/find-event' //TODO для организатора здесь ссылка на создание мероприятий или куда хочешь
                                                                           // можешь добавить, чтобы он куда-то еще шел или боавить сои кнопки или создать вообще свою шапку, чтобы не было тут разделений условно.
    return (
        <header className="site-header">
            <div className="logo">
                <h1>Party Finder</h1>
            </div>
            <nav className="site-nav">
                <ul>
                    {!isAuthenticated ? (
                        <>
                            <li><Link to="/register">Регистрация</Link></li>
                            <li><Link to="/login">Вход</Link></li>
                        </>
                    ) : (
                        <>
                            <li><Link to="/homepage">Главная</Link></li>
                            <li><Link to={profilePath}>Мой профиль</Link></li>
                            <li><Link to={eventsHandle}>Мероприятия</Link></li>
                            <li><button onClick={handleLogout}>Выход</button></li>
                        </>
                    )}
                </ul>
            </nav>
        </header>
    );
};

export default Header;