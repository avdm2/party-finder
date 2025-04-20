import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from './auth/AuthContext';
import '../styles/Header.css';
import { getProfileByUsernamePaginationClients } from "../api/ApiClientProfile";
import { getProfileByUsernamePaginationOrganizers } from "../api/ApiOrganizerProfile";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";

const Header = () => {
    const { isAuthenticated, role, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [showResults, setShowResults] = useState(false);
    const [pagination, setPagination] = useState({ page: 0, size: 5 });
    const [totalPages, setTotalPages] = useState(0);
    const [tokenUsername, setTokenUsername] = useState('');
    const [channelModalOpen, setChannelModalOpen] = useState(false);
    const [newChannelName, setNewChannelName] = useState('');
    const [profile, setProfile] = useState(null); // Добавляем состояние для профиля

    // Функция выхода из системы
    const handleLogout = () => {
        logout();
        navigate('');
    };

    // Определение путей для профиля и мероприятий
    const profilePath = role === 'ORGANIZER' ? '/organizer-profile/me' : '/profile/me';
    const eventsHandle = role === 'ORGANIZER' ? '/events' : '/find-event';

    // Поиск пользователей
    const handleSearchChange = (e) => {
        const term = e.target.value;
        setSearchTerm(term);
        if (term.length >= 3) {
            setPagination({ page: 0, size: 5 });
            fetchSearchResults(term, 0, 5);
        } else {
            setSearchResults([]);
            setShowResults(false);
            setPagination({ page: 0, size: 5 });
            setTotalPages(0);
        }
    };

    // Загрузка результатов поиска
    const fetchSearchResults = async (term, page, size) => {
        try {
            const token = localStorage.getItem("token");
            const [clientsResponse, organizersResponse] = await Promise.all([
                getProfileByUsernamePaginationClients(term, page, size, token),
                getProfileByUsernamePaginationOrganizers(term, page, size, token)
            ]);
            const combinedResults = [
                ...(clientsResponse.content || []).map(client => ({ ...client, type: 'client' })),
                ...(organizersResponse.content || []).map(organizer => ({ ...organizer, type: 'organizer' }))
            ];
            setSearchResults(combinedResults);
            setTotalPages(Math.max(clientsResponse.page.totalPages, organizersResponse.page.totalPages));
            setShowResults(true);
        } catch (error) {
            console.error("Ошибка при поиске пользователей и организаторов:", error.response?.data || error.message);
            setSearchResults([]);
            setShowResults(false);
        }
    };

    // Обработка клика по результату поиска
    const handleResultClick = (username, type) => {
        const token = localStorage.getItem("token");
        if (token) {
            const payload = JSON.parse(atob(token.split(".")[1]));
            if (username === payload.sub) {
                navigate(role === 'ORGANIZER' ? '/organizer-profile/me' : '/profile/me');
            } else {
                if (type === 'client') {
                    navigate(`/profile/${username}`);
                } else {
                    navigate(`/organizer-profile/${username}`);
                }
            }
        } else {
            navigate(`/profile/${username}`);
        }
        setSearchTerm('');
        setSearchResults([]);
        setShowResults(false);
    };

    // Проверка существования канала пользователя
    const checkUserChannel = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                console.error("Токен отсутствует в localStorage");
                return;
            }
            const payload = JSON.parse(atob(token.split(".")[1]));
            const ownerUsername = payload.sub;
            const response = await fetch(`http://localhost:8123/api/chat/owner/${ownerUsername}`, {
                method: 'GET',
                headers: { Authorization: `Bearer ${token}` },
            });
            if (response.ok) {
                const contentType = response.headers.get("content-type");
                if (contentType && contentType.includes("application/json")) {
                    const channel = await response.json();
                    console.log("Ответ сервера:", channel);
                    if (channel && channel.id) {
                        navigate(`/channel/${channel.id}`);
                    } else {
                        setChannelModalOpen(true);
                    }
                } else {
                    console.warn("Сервер вернул пустой ответ.");
                    setChannelModalOpen(true);
                }
            } else {
                console.error("Ошибка при проверке канала пользователя. Статус:", response.status);
            }
        } catch (error) {
            console.error("Ошибка при проверке канала пользователя:", error);
        }
    };

    // Метод для перехода к системе лояльности
    const handleLoyaltyClick = () => {
        if (!isAuthenticated || role !== 'ORGANIZER') {
            alert("Доступно только для организаторов.");
            return;
        }
        if (!profile) {
            alert("Профиль организатора не загружен.");
            return;
        }
        navigate(`/loyalty/organizer/${profile.id}`); // Используем ID организатора
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
                navigate(`/channel/${createdChannel.id}`);
            } else {
                alert("Ошибка при создании канала.");
            }
        } catch (error) {
            console.error("Ошибка при создании канала:", error);
        }
    };

    // Получение имени пользователя и профиля из токена
    useEffect(() => {
        const fetchProfile = async () => {
            const token = localStorage.getItem("token");
            if (!token) return;

            try {
                const payload = JSON.parse(atob(token.split(".")[1]));
                setTokenUsername(payload.sub);

                // Загружаем профиль организатора
                if (role === 'ORGANIZER') {
                    const response = await fetch(`http://localhost:8722/api/v1/organizer/username/${payload.sub}`, {
                        method: 'GET',
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    if (response.ok) {
                        const data = await response.json();
                        setProfile(data); // Сохраняем профиль в состояние
                    }
                }
            } catch (error) {
                console.error("Ошибка при загрузке профиля:", error);
            }
        };

        fetchProfile();
    }, [role]);

    // Переключение страницы поиска
    const handlePageChange = (newPage) => {
        if (newPage >= 0 && newPage < totalPages) {
            setPagination((prevPagination) => ({
                ...prevPagination,
                page: newPage,
            }));
        }
    };

    // Отображение кнопок пагинации
    const renderPaginationButtons = () => {
        const { page } = pagination;
        const pagesToShow = 3;
        let startPage = Math.max(0, page - Math.floor(pagesToShow / 2));
        let endPage = Math.min(totalPages - 1, startPage + pagesToShow - 1);
        if (endPage - startPage < pagesToShow - 1) {
            startPage = Math.max(0, endPage - pagesToShow + 1);
        }
        const pages = [];
        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }
        return (
            <div className="pagination">
                <button
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page === 0}
                    className="pagination-button"
                >
                    Назад
                </button>
                {pages.map((pageNum) => (
                    <button
                        key={pageNum}
                        data-page-number={pageNum + 1}
                        onClick={() => handlePageChange(pageNum)}
                        className={page === pageNum ? "active pagination-button" : "pagination-button"}
                    >
                        {pageNum + 1}
                    </button>
                ))}
                <button
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page === totalPages - 1}
                    className="pagination-button"
                >
                    Вперед
                </button>
            </div>
        );
    };

    return (
        <header className="site-header">
            <div className="logo">
                <h1>Party Finder</h1>
            </div>
            <nav className="site-nav">
                <ul>
                    {location.pathname === '/create-profile' ? (
                        <li>
                            <button onClick={handleLogout} className="button-link">
                                Выход
                            </button>
                        </li>
                    ) : !isAuthenticated ? (
                        <>
                            <li>
                                <Link to="/register" className="button-link">
                                    Регистрация
                                </Link>
                            </li>
                            <li>
                                <Link to="/login" className="button-link">
                                    Вход
                                </Link>
                            </li>
                        </>
                    ) : (
                        <>
                            <li>
                                <Link to="/home" className="button-link">
                                    Главная
                                </Link>
                            </li>
                            <li>
                                <Link to={profilePath} className="button-link">
                                    Мой профиль
                                </Link>
                            </li>
                            <li>
                                <Link to={eventsHandle} className="button-link">
                                    Мероприятия
                                </Link>
                            </li>
                            {role === 'ORGANIZER' && (
                                <>
                                    <li>
                                        <button onClick={checkUserChannel} className="button-link">
                                            Мой канал
                                        </button>
                                    </li>
                                    <li>
                                        <button onClick={handleLoyaltyClick} className="button-link">
                                            Лояльность
                                        </button>
                                    </li>
                                </>
                            )}
                            {role === 'PARTICIPANT' && (
                                <li>
                                    <button onClick={() => {}} className="button-link">
                                        Отслеживаемые каналы
                                    </button>
                                </li>
                            )}
                            <li>
                                <button onClick={handleLogout} className="button-link">
                                    Выход
                                </button>
                            </li>
                        </>
                    )}
                </ul>
            </nav>
            {location.pathname !== '/create-profile' && (
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
                                    <li key={user.username} onClick={() => handleResultClick(user.username, user.type)}>
                                        {user.username} {user.type === 'client' ? '(Пользователь)' : '(Организатор)'}
                                    </li>
                                ))}
                            </ul>
                            {totalPages > 1 && renderPaginationButtons()}
                        </div>
                    )}
                </div>
            )}
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