import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Avatar, Chip } from '@mui/material';
import { CalendarToday, LocationOn, People, AttachMoney, Star } from '@mui/icons-material';
import '../../styles/MyEventsPage.css';
import { getMyEvents } from '../../api/ApiClientEvent';

const MyEventsPage = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchMyEvents = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    navigate('/login');
                    return;
                }

                const eventsData = await getMyEvents(token);
                setEvents(eventsData);
                setError(null);
            } catch (err) {
                console.error("Ошибка при загрузке мероприятий:", err);
                setError("Не удалось загрузить ваши мероприятия");
            } finally {
                setLoading(false);
            }
        };

        fetchMyEvents();
    }, [navigate]);

    const handleEventClick = (eventId) => {
        navigate(`/event/${eventId}`);
    };

    if (loading) {
        return <div className="my-events-loading">Загрузка ваших мероприятий...</div>;
    }

    if (error) {
        return <div className="my-events-error">{error}</div>;
    }

    return (
        <div className="my-events-container">
            <h1 className="my-events-title">Мои мероприятия</h1>

            {events.length === 0 ? (
                <div className="no-events">
                    <p>Вы пока не подписаны ни на одно мероприятие</p>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => navigate('/find-event')}
                    >
                        Найти мероприятия
                    </Button>
                </div>
            ) : (
                <div className="events-grid">
                    {events.map(event => (
                        <div key={event.id} className="event-card">
                            <div className="event-image-container">
                                <Avatar
                                    sx={{
                                        width: 80,
                                        height: 80,
                                        bgcolor: 'rgba(106, 17, 203, 0.1)',
                                        color: '#6a11cb'
                                    }}
                                >
                                    <CalendarToday fontSize="large" />
                                </Avatar>
                            </div>
                            <div className="event-details">
                                <h3 className="event-title">{event.title}</h3>
                                <div className="event-meta">
                                    <Chip
                                        icon={<LocationOn />}
                                        label={event.address}
                                        size="small"
                                        sx={{ mr: 1, mb: 1 }}
                                    />
                                    <Chip
                                        icon={<CalendarToday />}
                                        label={new Date(event.dateOfEvent).toLocaleString()}
                                        size="small"
                                        sx={{ mr: 1, mb: 1 }}
                                    />
                                    {event.price && (
                                        <Chip
                                            icon={<AttachMoney />}
                                            label={`${event.price} ₽`}
                                            size="small"
                                            sx={{ mr: 1, mb: 1 }}
                                        />
                                    )}
                                </div>
                                <Button
                                    variant="outlined"
                                    color="primary"
                                    onClick={() => handleEventClick(event.id)}
                                    sx={{ mt: 2 }}
                                >
                                    Подробнее
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyEventsPage;