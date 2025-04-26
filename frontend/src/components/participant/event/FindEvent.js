import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../../styles/FindEvent.css";
import { fetchEventsRequest } from "../../../api/ApiFindEvents";
import { FiSearch, FiCalendar, FiMapPin, FiDollarSign, FiUsers, FiStar } from "react-icons/fi";

const FindEvent = () => {
    const navigate = useNavigate();
    const [filters, setFilters] = useState({
        title: "",
        description: "",
        startDate: "",
        endDate: "",
        address: "",
        status: "",
        minPrice: "",
        maxPrice: "",
        minCapacity: "",
        maxCapacity: "",
        minAge: "",
        maxAge: "",
    });

    const [events, setEvents] = useState([]);
    const [pagination, setPagination] = useState({ page: 0, size: 10 });
    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        fetchEvents(filters, pagination);
    }, [filters, pagination]);

    const fetchEvents = async (filters, pagination) => {
        try {
            const response = await fetchEventsRequest(filters, pagination);
            setEvents(response.content);
            setTotalPages(response.totalPages);
        } catch (error) {
            console.error("Ошибка при загрузке мероприятий:", error);
        }
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters((prevFilters) => ({
            ...prevFilters,
            [name]: value,
        }));
    };

    const handleSearch = (e) => {
        e.preventDefault();
        setPagination({ page: 0, size: 10 });
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 0 && newPage < totalPages) {
            setPagination((prevPagination) => ({
                ...prevPagination,
                page: newPage,
            }));
        }
    };

    const handleEventDetails = (eventId) => {
        navigate(`/event/${eventId}`);
    };

    return (
        <div className="find-event-container">
            <div className="search-header">
                <h1>Поиск мероприятий</h1>
            </div>

            <form onSubmit={handleSearch} className="search-form">
                <div className="form-group">
                    <label className="form-label">
                        Название мероприятия
                    </label>
                    <div className="search-input-container">
                        <FiSearch className="search-input-icon" />
                        <input
                            type="text"
                            name="title"
                            value={filters.title}
                            onChange={handleFilterChange}
                            className="search-input"
                            placeholder="Введите название мероприятия"
                        />
                    </div>
                </div>

                <div className="form-group">
                    <label className="form-label">
                        Описание
                    </label>
                    <input
                        type="text"
                        name="description"
                        value={filters.description}
                        onChange={handleFilterChange}
                        className="form-input"
                        placeholder="Введите ключевые слова"
                    />
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label className="form-label">
                            <FiCalendar /> Дата начала
                        </label>
                        <input
                            type="datetime-local"
                            name="startDate"
                            value={filters.startDate}
                            onChange={handleFilterChange}
                            className="form-input"
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">
                            <FiCalendar /> Дата окончания
                        </label>
                        <input
                            type="datetime-local"
                            name="endDate"
                            value={filters.endDate}
                            onChange={handleFilterChange}
                            className="form-input"
                        />
                    </div>
                </div>

                <div className="form-group">
                    <label className="form-label">
                        <FiMapPin /> Адрес
                    </label>
                    <input
                        type="text"
                        name="address"
                        value={filters.address}
                        onChange={handleFilterChange}
                        className="form-input"
                        placeholder="Город, улица, дом"
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">
                        Статус мероприятия
                    </label>
                    <select
                        name="status"
                        value={filters.status}
                        onChange={handleFilterChange}
                        className="form-select"
                    >
                        <option value="">Все статусы</option>
                        <option value="COMPLETED">Прошедшие мероприятия</option>
                        <option value="CANCELLED">Отмененные мероприятия</option>
                        <option value="ONGOING">Мероприятия идут сейчас</option>
                        <option value="UPCOMING">Будущие мероприятия</option>
                    </select>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label className="form-label">
                            <FiDollarSign /> Минимальная цена
                        </label>
                        <input
                            type="number"
                            name="minPrice"
                            value={filters.minPrice}
                            onChange={handleFilterChange}
                            className="form-input"
                            placeholder="От"
                            min="0"
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">
                            <FiDollarSign /> Максимальная цена
                        </label>
                        <input
                            type="number"
                            name="maxPrice"
                            value={filters.maxPrice}
                            onChange={handleFilterChange}
                            className="form-input"
                            placeholder="До"
                            min="0"
                        />
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label className="form-label">
                            <FiUsers /> Мин. вместимость
                        </label>
                        <input
                            type="number"
                            name="minCapacity"
                            value={filters.minCapacity}
                            onChange={handleFilterChange}
                            className="form-input"
                            placeholder="От"
                            min="1"
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">
                            <FiUsers /> Макс. вместимость
                        </label>
                        <input
                            type="number"
                            name="maxCapacity"
                            value={filters.maxCapacity}
                            onChange={handleFilterChange}
                            className="form-input"
                            placeholder="До"
                            min="1"
                        />
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label className="form-label">
                            <FiStar /> Минимальный возраст
                        </label>
                        <input
                            type="number"
                            name="minAge"
                            value={filters.minAge}
                            onChange={handleFilterChange}
                            className="form-input"
                            placeholder="От"
                            min="0"
                            max="100"
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">
                            <FiStar /> Максимальный возраст
                        </label>
                        <input
                            type="number"
                            name="maxAge"
                            value={filters.maxAge}
                            onChange={handleFilterChange}
                            className="form-input"
                            placeholder="До"
                            min="0"
                            max="100"
                        />
                    </div>
                </div>
            </form>

            <div className="events-section">
                <h3 className="section-title">Найденные мероприятия</h3>

                {events.length > 0 ? (
                    <div className="events-grid">
                        {events.map((event) => (
                            <div key={event.id} className="event-card">
                                <div className="event-image-container">
                                    {event.imageUrl ? (
                                        <img src={event.imageUrl} alt={event.title} className="event-image" />
                                    ) : (
                                        <div className="event-image-placeholder"></div>
                                    )}
                                </div>
                                <div className="event-details">
                                    <h3 className="event-title">{event.title}</h3>
                                    <p className="event-date">
                                        <FiCalendar /> {new Date(event.dateOfEvent).toLocaleString()}
                                    </p>
                                    <p className="event-location">
                                        <FiMapPin /> {event.address}
                                    </p>
                                    <p className="event-description">{event.description}</p>
                                    <div className="event-actions">
                                        <button
                                            className="details-button"
                                            onClick={() => handleEventDetails(event.id)}
                                        >
                                            Подробнее
                                        </button>
                                        <span className="event-price">
                                            {event.price > 0 ? `${event.price} ₽` : "Бесплатно"}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="no-events">
                        <p>Мероприятий не найдено. Попробуйте изменить параметры поиска.</p>
                    </div>
                )}
            </div>

            {totalPages > 1 && (
                <div className="pagination">
                    <button
                        onClick={() => handlePageChange(pagination.page - 1)}
                        disabled={pagination.page === 0}
                        className="pagination-button"
                    >
                        Назад
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i).map((page) => (
                        <button
                            key={page}
                            onClick={() => handlePageChange(page)}
                            className={`pagination-button ${pagination.page === page ? "active" : ""}`}
                        >
                            {page + 1}
                        </button>
                    ))}
                    <button
                        onClick={() => handlePageChange(pagination.page + 1)}
                        disabled={pagination.page === totalPages - 1}
                        className="pagination-button"
                    >
                        Вперед
                    </button>
                </div>
            )}
        </div>
    );
};

export default FindEvent;