import React, {useState, useEffect} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {useAuth} from '../services/auth/AuthContext';
import '../styles/Header.css';
import {getProfileByUsernamePagination} from "../utils/ApiClientProfile";

const Header = () => {
    const {isAuthenticated, role, logout} = useAuth();
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [showResults, setShowResults] = useState(false);
    const [pagination, setPagination] = useState({page: 0, size: 5});
    const [totalPages, setTotalPages] = useState(0);

    const handleLogout = () => {
        logout();
        navigate('');
    };

    const profilePath = role === 'ORGANIZER' ? '/organizer-profile' : '/profile/me';
    const eventsHandle = role === 'ORGANIZER' ? '/events' : '/find-event';

    const handleSearchChange = (e) => {
        const term = e.target.value;
        setSearchTerm(term);
        if (term.length >= 3) {
            setPagination({page: 0, size: 5});
            fetchSearchResults(term, 0, 5);
        } else {
            setSearchResults([]);
            setShowResults(false);
            setPagination({page: 0, size: 5});
            setTotalPages(0);
        }
    };

    const fetchSearchResults = async (term, page, size) => {
        try {
            const token = localStorage.getItem("token");
            const response = await getProfileByUsernamePagination(term, page, size, token);
            setSearchResults(response.content);
            setTotalPages(response.page.totalPages);
            setShowResults(true);
        } catch (error) {
            console.error("Ошибка при поиске пользователей:", error.response?.data || error.message);
            setSearchResults([]);
            setShowResults(false);
        }
    };

    const handleResultClick = (username) => {
        navigate(`/profile/${username}`);
        setSearchTerm('');
        setSearchResults([]);
        setShowResults(false);
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 0 && newPage < totalPages) {
            setPagination((prevPagination) => ({
                ...prevPagination,
                page: newPage,
            }));
        }
    };

    useEffect(() => {
        if (searchTerm.length > 3) {
            fetchSearchResults(searchTerm, pagination.page, pagination.size);
        }
    }, [pagination.page, pagination.size]);

    const renderPaginationButtons = () => {
        const {page} = pagination;
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
                    {!isAuthenticated ? (
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
                            <li>
                                <button onClick={handleLogout} className="button-link">
                                    Выход
                                </button>
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
                        {totalPages > 1 && renderPaginationButtons()}
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;