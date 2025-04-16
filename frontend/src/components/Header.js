import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../services/auth/AuthContext';
import '../styles/Header.css';
import { Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button } from "@mui/material";

const Header = () => {
    const { isAuthenticated, role, username, logout } = useAuth();
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [showResults, setShowResults] = useState(false);

    // Состояния для модального окна канала
    const [channelModalOpen, setChannelModalOpen] = useState(false);
    const [newChannelName, setNewChannelName] = useState('');

    const profilePath = role === 'ORGANIZER' ? '/organizer-profile' : '/profile/me';
    const eventsHandle = role === 'ORGANIZER' ? '/events' : '/find-event';

    const handleLogout = () => {
        logout();
        navigate('');
    };

    const handleSearchChange = (e) => {
        const term = e.target.value;
        setSearchTerm(term);
        if (term.length >= 3) {
            fetchSearchResults(term);
        } else {
            setSearchResults([]);
            setShowResults(false);
        }
    };

    const fetchSearchResults = async (term) => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`http://localhost:8724/api/profile/search?query=${term}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (response.ok) {
                const data = await response.json();
                setSearchResults(data);
                setShowResults(true);
            }
        } catch (error) {
            console.error("Ошибка при поиске пользователей:", error);
        }
    };

    const handleResultClick = (username) => {
        navigate(`/profile/${username}`);
        setSearchTerm('');
        setSearchResults([]);
        setShowResults(false);
    };

    // Проверка существования канала пользователя
    const checkUserChannel = async () => {
        try {
            const token = localStorage.getItem("token");
            const payload = JSON.parse(atob(token.split(".")[1]));
            const ownerUsername = payload.sub;

            const response = await fetch(`http://localhost:8123/api/chat/owner/${ownerUsername}`, {
                method: 'GET',
                headers: { Authorization: `Bearer ${token}` },
            });

            if (response.ok) {
                const channel = await response.json();
                if (channel && channel.id) {
                    navigate(`/channel/${channel.id}`); // Переход к существующему каналу
                } else {
                    setChannelModalOpen(true); // Открытие модального окна для создания канала
                }
            } else {
                console.error("Ошибка при проверке канала пользователя.");
            }
        } catch (error) {
            console.error("Ошибка при проверке канала пользователя:", error);
        }
    };

    // Создание нового канала
    const handleCreateChannel = async () => {
        try {
            const token = localStorage.getItem("token");
            const payload = JSON.parse(atob(token.split(".")[1]));
            const ownerUsername = payload.sub;

            const response = await fetch('http://localhost:8123/api/chat/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ name: newChannelName, ownerUsername }),
            });

            if (response.ok) {
                const createdChannel = await response.json();
                setChannelModalOpen(false);
                navigate(`/channel/${createdChannel.id}`); // Переадресация на страницу канала
            } else {
                alert("Ошибка при создании канала.");
            }
        } catch (error) {
            console.error("Ошибка при создании канала:", error);
        }
    };

    return (
        <header className="site-header">
            <div className="logo">
                <h1>Party Finder</h1>
            </div>
            <nav className="site-nav">
                <ul>
                    {!isAuthenticated ? (
                        <>
                            <li>
                                <Link to="/register" className="button-link">Регистрация</Link>
                            </li>
                            <li>
                                <Link to="/login" className="button-link">Вход</Link>
                            </li>
                        </>
                    ) : (
                        <>
                            <li>
                                <Link to="/home" className="button-link">Главная</Link>
                            </li>
                            <li>
                                <Link to={profilePath} className="button-link">Мой профиль</Link>
                            </li>
                            <li>
                                <Link to={eventsHandle} className="button-link">Мероприятия</Link>
                            </li>
                            {role === 'ORGANIZER' && (
                                <li>
                                    <button onClick={checkUserChannel} className="button-link">Канал</button>
                                </li>
                            )}
                            <li>
                                <button onClick={handleLogout} className="button-link">Выход</button>
                            </li>
                        </>
                    )}
                </ul>
            </nav>
            <div className="search-bar">
                <input
                    type="text"
                    placeholder="Поиск пользователей..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                />
                {showResults && searchResults.length > 0 && (
                    <div className="search-results-container">
                        <ul className="search-results">
                            {searchResults.map((user) => (
                                <li key={user.username} onClick={() => handleResultClick(user.username)}>
                                    {user.username}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>

            {/* Модальное окно для создания канала */}
            <Dialog open={channelModalOpen} onClose={() => setChannelModalOpen(false)}>
                <DialogTitle>Создание канала</DialogTitle>
                <DialogContent>
                    <TextField
                        fullWidth
                        margin="dense"
                        label="Название канала"
                        name="name"
                        value={newChannelName}
                        onChange={(e) => setNewChannelName(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCreateChannel} variant="contained" color="primary">
                        Создать
                    </Button>
                    <Button onClick={() => setChannelModalOpen(false)} variant="outlined" color="secondary">
                        Отмена
                    </Button>
                </DialogActions>
            </Dialog>
        </header>
    );
};

export default Header;