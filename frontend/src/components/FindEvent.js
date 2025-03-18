import React, { useState } from "react";
import axios from "axios"; // Для запросов к API
import "../styles/FindEvent.css";

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

    const [events, setEvents] = useState([]); // Список мероприятий
    const [pagination, setPagination] = useState({ page: 0, size: 10 }); // Параметры пагинации
    const [totalPages, setTotalPages] = useState(0); // Общее количество страниц

    // Функция для выполнения запроса к API
    const fetchEvents = async (filters, pagination) => {
        try {
            const response = await axios.get("/api/events/filter/", {
                params: { ...filters, ...pagination },
            });
            setEvents(response.data.content); // Список мероприятий
            setTotalPages(response.data.totalPages); // Общее количество страниц
        } catch (error) {
            console.error("Ошибка при загрузке мероприятий:", error);
        }
    };

    // Обработка изменения фильтров
    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters((prevFilters) => ({
            ...prevFilters,
            [name]: value,
        }));
    };

    // Функция для поиска мероприятий
    const handleSearch = (e) => {
        e.preventDefault(); // Отменяем стандартное поведение формы
        // Сбрасываем страницу на 0 при новом поиске
        setPagination({ page: 0, size: 10 });
        fetchEvents(filters, { page: 0, size: 10 });
    };

    // Функция для пагинации
    const handlePageChange = (newPage) => {
        setPagination((prevPagination) => ({
            ...prevPagination,
            page: newPage,
        }));
        fetchEvents(filters, { ...pagination, page: newPage });
    };

    return (
        <div className="find-event-container">
            <h2>Поиск мероприятий</h2>
            <form onSubmit={handleSearch}> {/* Добавляем onSubmit */}
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
                    <input
                        type="text"
                        name="status"
                        value={filters.status}
                        onChange={handleFilterChange}
                    />
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

            {/* Пагинация */}
            <div className="pagination">
                {Array.from({ length: totalPages }, (_, i) => i).map((page) => (
                    <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={pagination.page === page ? "active" : ""}
                    >
                        {page + 1}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default FindEvent;