import React, { useState, useEffect } from "react";
import "../../styles/FindEvent.css";
import { fetchEventsRequest } from "../../api/ApiFindEvents";

const FindEvent = () => {
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

    return (
        <div className="find-event-container">
            <h2>Поиск мероприятий</h2>
            <form onSubmit={handleSearch}>
                <label>
                    Название:
                    <input
                        type="text"
                        name="title"
                        value={filters.title}
                        onChange={handleFilterChange}
                    />
                </label>
                <br />
                <label>
                    Описание:
                    <input
                        type="text"
                        name="description"
                        value={filters.description}
                        onChange={handleFilterChange}
                    />
                </label>
                <br />
                <label>
                    Дата начала:
                    <input
                        type="datetime-local"
                        name="startDate"
                        value={filters.startDate}
                        onChange={handleFilterChange}
                    />
                </label>
                <br />
                <label>
                    Дата окончания:
                    <input
                        type="datetime-local"
                        name="endDate"
                        value={filters.endDate}
                        onChange={handleFilterChange}
                    />
                </label>
                <br />
                <label>
                    Адрес:
                    <input
                        type="text"
                        name="address"
                        value={filters.address}
                        onChange={handleFilterChange}
                    />
                </label>
                <br />
                <label>
                    Статус:
                    <select
                        name="status"
                        value={filters.status}
                        onChange={handleFilterChange}
                    >
                        <option value="">Все статусы</option>
                        <option value="COMPLETED">Прошедшие мероприятия</option>
                        <option value="CANCELLED">Отмененные мероприятия</option>
                        <option value="ONGOING">Мероприятия идут сейчас</option>
                        <option value="UPCOMING">Будущие мероприятия</option>
                    </select>
                </label>
                <br />
                <label>
                    Минимальная цена:
                    <input
                        type="number"
                        name="minPrice"
                        value={filters.minPrice}
                        onChange={handleFilterChange}
                    />
                </label>
                <br />
                <label>
                    Максимальная цена:
                    <input
                        type="number"
                        name="maxPrice"
                        value={filters.maxPrice}
                        onChange={handleFilterChange}
                    />
                </label>
                <br />
                <label>
                    Минимальная вместимость:
                    <input
                        type="number"
                        name="minCapacity"
                        value={filters.minCapacity}
                        onChange={handleFilterChange}
                    />
                </label>
                <br />
                <label>
                    Максимальная вместимость:
                    <input
                        type="number"
                        name="maxCapacity"
                        value={filters.maxCapacity}
                        onChange={handleFilterChange}
                    />
                </label>
                <br />
                <label>
                    Минимальный возраст:
                    <input
                        type="number"
                        name="minAge"
                        value={filters.minAge}
                        onChange={handleFilterChange}
                    />
                </label>
                <br />
                <label>
                    Максимальный возраст:
                    <input
                        type="number"
                        name="maxAge"
                        value={filters.maxAge}
                        onChange={handleFilterChange}
                    />
                </label>
                <br />
                <button type="submit" className="search-button">
                    Найти
                </button>
            </form>

            <h3>Список мероприятий:</h3>
            <ul>
                {events.map((event) => (
                    <li key={event.id}>
                        <strong>{event.title}</strong> - {event.description}
                        <br />
                        Дата: {event.dateOfEvent}, Адрес: {event.address}
                    </li>
                ))}
            </ul>

            <div className="pagination">
                <button
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page === 0}
                >
                    Назад
                </button>
                {Array.from({ length: totalPages }, (_, i) => i).map((page) => (
                    <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={pagination.page === page ? "active" : ""}
                    >
                        {page + 1}
                    </button>
                ))}
                <button
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page === totalPages - 1}
                >
                    Вперед
                </button>
            </div>
        </div>
    );
};

export default FindEvent;