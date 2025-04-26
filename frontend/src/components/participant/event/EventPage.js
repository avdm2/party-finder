import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {getEventById, subscribeToEvent, checkEventSubscription, cancelSubscription} from "../../../api/ApiClientEvent";
import "../../../styles/EventPageUser.css";
import { Button, Avatar, Chip, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { LocationOn, CalendarToday, People, AttachMoney, Star, EventAvailable } from "@mui/icons-material";

const EventPage = () => {
    const { eventId } = useParams();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [dialogMessage, setDialogMessage] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchEventData = async () => {
            try {
                const token = localStorage.getItem("token");
                const [eventData, isSubscribed] = await Promise.all([
                    getEventById(eventId),
                    token ? checkEventSubscription(eventId, token) : false
                ]);

                setEvent(eventData);
                setIsSubscribed(isSubscribed);
                setError(null);
            } catch (err) {
                console.error("Ошибка при загрузке события:", err);
                setError("Событие не найдено");
            } finally {
                setLoading(false);
            }
        };

        fetchEventData();
    }, [eventId]);

    const handleSubscribe = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                navigate("/login");
                return;
            }

            const payload = JSON.parse(atob(token.split(".")[1]));
            const roles = payload.roles || [];

            if (!roles.includes("PARTICIPANT")) {
                setDialogMessage("Только пользователи могут подписываться на события");
                setIsDialogOpen(true);
                return;
            }

            await subscribeToEvent(event.id, token);
            setIsSubscribed(true);
            setDialogMessage("Вы успешно подписались на событие!");
            setIsDialogOpen(true);
        } catch (error) {
            console.error("Ошибка при подписке на событие:", error);
            setDialogMessage("Произошла ошибка при подписке на событие");
            setIsDialogOpen(true);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "COMPLETED":
                return "default";
            case "CANCELLED":
                return "error";
            case "ONGOING":
                return "warning";
            case "UPCOMING":
                return "success";
            default:
                return "default";
        }
    };

    const getStatusLabel = (status) => {
        switch (status) {
            case "COMPLETED":
                return "Завершено";
            case "CANCELLED":
                return "Отменено";
            case "ONGOING":
                return "Идет сейчас";
            case "UPCOMING":
                return "Предстоящее";
            default:
                return status;
        }
    };

    const handleCloseDialog = () => {
        setIsDialogOpen(false);
    };

    if (loading) {
        return <div className="event-loading">Загрузка события...</div>;
    }
    if (error) {
        return (
            <div className="event-error">
                <h2>{error}</h2>
                <button className="back-button" onClick={() => navigate(-1)}>
                    Назад
                </button>
            </div>
        );
    }

    const handleUnsubscribe = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                navigate("/login");
                return;
            }

            const payload = JSON.parse(atob(token.split(".")[1]));
            await cancelSubscription(event.id, payload.sub, token);

            setIsSubscribed(false);
            setDialogMessage("Вы успешно отписались от события!");
            setIsDialogOpen(true);
        } catch (error) {
            console.error("Ошибка при отписке от события:", error);
            setDialogMessage("Произошла ошибка при отписке от события");
            setIsDialogOpen(true);
        }
    };


    return (
        <div className="event-container">
            <div className="event-header">
                <div className="event-main-info">
                    <div className="event-avatar-container">
                        <div className="event-avatar">
                            <EventAvailable fontSize="large" />
                        </div>
                    </div>
                    <div className="event-title-section">
                        <h1 className="event-title">{event.title}</h1>
                        <div className="event-status">
                            <Chip
                                label={getStatusLabel(event.status)}
                                color={getStatusColor(event.status)}
                                size="medium"
                                sx={{ fontWeight: 600 }}
                            />
                        </div>
                    </div>
                </div>

                <div className="event-meta-grid">
                    <div className="meta-card">
                        <div className="meta-icon">
                            <LocationOn fontSize="small" />
                        </div>
                        <div className="meta-text">
                            <div className="meta-label">Адрес</div>
                            <div className="meta-value">{event.address}</div>
                        </div>
                    </div>

                    <div className="meta-card">
                        <div className="meta-icon">
                            <CalendarToday fontSize="small" />
                        </div>
                        <div className="meta-text">
                            <div className="meta-label">Дата</div>
                            <div className="meta-value">
                                {new Date(event.dateOfEvent).toLocaleString()}
                            </div>
                        </div>
                    </div>

                    {event.price && (
                        <div className="meta-card">
                            <div className="meta-icon">
                                <AttachMoney fontSize="small" />
                            </div>
                            <div className="meta-text">
                                <div className="meta-label">Цена</div>
                                <div className="meta-value">{event.price} ₽</div>
                            </div>
                        </div>
                    )}

                    {event.capacity && (
                        <div className="meta-card">
                            <div className="meta-icon">
                                <People fontSize="small" />
                            </div>
                            <div className="meta-text">
                                <div className="meta-label">Вместимость</div>
                                <div className="meta-value">{event.capacity} мест</div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="event-content">
                <h3 className="section-title">Описание</h3>
                <div className="event-description">
                    {event.description}
                </div>

                <h3 className="section-title">Детали события</h3>
                <div className="event-details-grid">
                    <div className="detail-card">
                        <span className="detail-label">Статус</span>
                        <span className="detail-value">
                        {getStatusLabel(event.status)}
                    </span>
                    </div>

                    <div className="detail-card">
                        <span className="detail-label">Организатор</span>
                        <span className="detail-value">{event.organizerId}</span>
                    </div>

                    {event.age && (
                        <div className="detail-card">
                            <span className="detail-label">Возрастное ограничение</span>
                            <span className="detail-value">{event.age}+</span>
                        </div>
                    )}

                    {event.rating && (
                        <div className="detail-card">
                            <span className="detail-label">Рейтинг</span>
                            <span className="detail-value">{event.rating}</span>
                        </div>
                    )}
                </div>

                <div className="event-actions">
                    {isSubscribed ? (
                        <button
                            className="unsubscribe-btn"
                            onClick={handleUnsubscribe}
                        >
                            <span className="subscribe-btn-icon">✕</span>
                            Отписаться
                        </button>
                    ) : (
                        <button
                            className="subscribe-btn"
                            onClick={handleSubscribe}
                        >
                            <span className="subscribe-btn-icon">+</span>
                            Подписаться
                        </button>
                    )}
                </div>
            </div>

            <Dialog open={isDialogOpen} onClose={handleCloseDialog}>
                <DialogTitle>{isSubscribed ? "Успешно" : "Ошибка"}</DialogTitle>
                <DialogContent>
                    {dialogMessage}
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={handleCloseDialog}
                        color="primary"
                        sx={{
                            textTransform: "none",
                            fontWeight: 500
                        }}
                    >
                        Закрыть
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default EventPage;