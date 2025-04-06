import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    Box,
    Typography,
    IconButton,
    Grid,
    Paper, Slider,
} from "@mui/material";
import { Edit } from "@mui/icons-material";

function EventsPage() {
    const [events, setEvents] = useState([]);
    const [eventModalOpen, setEventModalOpen] = useState(false);
    const [formDataEvent, setFormDataEvent] = useState({
        id: null,
        title: "",
        description: "",
        dateOfEvent: "",
        address: "",
        price: 0,
        capacity: 0,
        age: 0,
    });
    const [profile, setProfile] = useState(null); // Добавляем состояние для профиля
    const navigate = useNavigate();

    // Загрузка профиля организатора
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) return navigate("/login");

        const payload = JSON.parse(atob(token.split(".")[1]));
        if (!payload.roles.includes("ORGANIZER")) return navigate("/home");

        getOrganizerProfile(payload.sub).then((data) => {
            if (data) {
                setProfile(data); // Сохраняем профиль
                fetchEvents(data.id); // Загружаем мероприятия
            } else {
                navigate("/home");
            }
        });
    }, [navigate]);

    const fetchEvents = async (organizerId) => {
        const token = localStorage.getItem("token");
        const response = await fetch(`http://localhost:8722/api/organizers/event/list/${organizerId}`, {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
        });

        if (response.ok) {
            const data = await response.json();
            setEvents(data);
        } else {
            console.error("Ошибка загрузки мероприятий");
        }
    };

    const handleOpenEventModal = (event = null) => {
        if (event) {
            setFormDataEvent({ ...event });
        } else {
            setFormDataEvent({
                id: null,
                title: "",
                description: "",
                dateOfEvent: "",
                address: "",
                price: 0,
                capacity: 0,
                age: 0,
            });
        }
        setEventModalOpen(true);
    };

    const handleChangeEvent = (e) => {
        setFormDataEvent((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSaveEvent = async () => {
        // Проверка даты
        const currentDate = new Date();
        const eventDate = new Date(formDataEvent.dateOfEvent);

        if (isNaN(eventDate.getTime())) {
            alert("Введите корректную дату.");
            return;
        }

        if (eventDate <= currentDate) {
            alert("Дата мероприятия должна быть позже текущего времени.");
            return;
        }

        const maxDate = new Date();
        maxDate.setFullYear(currentDate.getFullYear() + 2); // +2 года

        if (eventDate > maxDate) {
            alert("Дата мероприятия не может быть позже чем через 2 года.");
            return;
        }

        // Преобразуем дату к формату yyyy-MM-dd'T'HH:mm:ss
        const formattedEventData = {
            ...formDataEvent,
            organizerId: profile?.id, // Используем UUID из профиля
            dateOfEvent: eventDate.toISOString().slice(0, 19).replace("T", "T"),
            status: "UPCOMING",
        };

        const token = localStorage.getItem("token");
        const method = formDataEvent.id ? "PUT" : "POST";
        const url = formDataEvent.id
            ? `http://localhost:8722/api/organizers/event/update/${formDataEvent.id}`
            : "http://localhost:8722/api/organizers/event";

        const response = await fetch(url, {
            method,
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(formattedEventData),
        });

        if (response.ok) {
            fetchEvents(profile?.id); // Обновляем список мероприятий
            setEventModalOpen(false);
        } else {
            console.error("Ошибка сохранения мероприятия");
        }
    };

    const handleEditEvent = async (eventId) => {
        const token = localStorage.getItem("token");
        const response = await fetch(`http://localhost:8722/api/organizers/event/${eventId}`, {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
        });

        if (response.ok) {
            const eventData = await response.json();
            setFormDataEvent({
                id: eventData.id,
                title: eventData.title,
                description: eventData.description,
                dateOfEvent: new Date(eventData.dateOfEvent).toISOString().slice(0, 16), // Преобразуем дату в формат datetime-local
                address: eventData.address,
                price: eventData.price,
                capacity: eventData.capacity,
                age: eventData.age,
            });
            setEventModalOpen(true); // Открываем модальное окно
        } else {
            console.error("Ошибка загрузки данных мероприятия");
        }
    };

    const handleCancelEvent = async (eventId) => {
        const token = localStorage.getItem("token");
        const response = await fetch(`http://localhost:8722/api/organizers/event/cancel/${eventId}`, {
            method: "PUT",
            headers: { Authorization: `Bearer ${token}` },
        });

        if (response.ok) {
            setEvents((prevEvents) =>
                prevEvents.map((event) =>
                    event.id === eventId ? { ...event, status: "CANCELLED" } : event
                )
            );
        } else {
            console.error("Ошибка отмены мероприятия");
        }
    };

    const renderEventsByStatus = (status) => {
        const filteredEvents = events.filter((event) => event.status === status);
        if (filteredEvents.length === 0) return null;

        return (
            <Box sx={{ mt: 2 }}>
                <Typography variant="h6">{status}</Typography>
                <Grid container spacing={2}>
                    {filteredEvents.map((event) => (
                        <Grid item xs={12} key={event.id}>
                            <Paper
                                sx={{
                                    p: 2,
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                }}
                            >
                                <Box>
                                    <Typography variant="h6">{event.title}</Typography>
                                    <Typography variant="body2">{event.description}</Typography>
                                    <Typography
                                        variant="body2"
                                    >{`Дата: ${new Date(event.dateOfEvent).toLocaleString("ru-RU")}`}</Typography>
                                    <Typography variant="body2">{`Адрес: ${event.address}`}</Typography>
                                    <Typography variant="body2">{`Цена: ${event.price} ₽`}</Typography>
                                    <Typography variant="body2">{`Вместимость: ${event.capacity}`}</Typography>
                                    <Typography variant="body2">{`Возраст: ${event.age}+`}</Typography>
                                </Box>
                                <Box>
                                    <IconButton onClick={() => handleEditEvent(event.id)}>
                                        <Edit />
                                    </IconButton>
                                    {event.status === "UPCOMING" && (
                                        <Button
                                            color="error"
                                            onClick={() => handleCancelEvent(event.id)}
                                        >
                                            Отменить
                                        </Button>
                                    )}
                                </Box>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>
            </Box>
        );
    };

    return (
        <Box
            sx={{
                maxWidth: 800,
                margin: "auto",
                textAlign: "center",
                p: 3,
                bgcolor: "background.paper",
                borderRadius: 2,
                boxShadow: 3,
            }}
        >
            <Typography variant="h4">Мои мероприятия</Typography>
            {profile ? (
                <>
                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => handleOpenEventModal()}
                        sx={{ mt: 2 }}
                    >
                        Создать мероприятие
                    </Button>
                    {["COMPLETED", "CANCELLED", "ONGOING", "UPCOMING"].map((status) =>
                        renderEventsByStatus(status)
                    )}
                </>
            ) : (
                <Typography variant="body1">Загрузка...</Typography>
            )}

            {/* Диалог создания/редактирования мероприятия */}
            <Dialog open={eventModalOpen} onClose={() => setEventModalOpen(false)}>
                <DialogTitle>{formDataEvent.id ? "Редактировать мероприятие" : "Создать мероприятие"}</DialogTitle>
                <DialogContent>
                    {/* Остальные поля остаются без изменений */}
                    <TextField
                        fullWidth
                        margin="dense"
                        label="UUID создателя"
                        name="owner_uuid"
                        value={profile?.id || "empty"}
                        InputProps={{ readOnly: true }}
                    />
                    <TextField
                        fullWidth
                        margin="dense"
                        label="Название"
                        name="title"
                        value={formDataEvent.title}
                        onChange={handleChangeEvent}
                    />
                    <TextField
                        fullWidth
                        margin="dense"
                        label="Описание"
                        name="description"
                        value={formDataEvent.description}
                        onChange={handleChangeEvent}
                    />
                    <TextField
                        fullWidth
                        margin="dense"
                        type="datetime-local"
                        name="dateOfEvent"
                        value={formDataEvent.dateOfEvent}
                        onChange={handleChangeEvent}
                        InputLabelProps={{ shrink: true }}
                    />
                    <TextField
                        fullWidth
                        margin="dense"
                        label="Адрес"
                        name="address"
                        value={formDataEvent.address}
                        onChange={handleChangeEvent}
                    />
                    <TextField
                        fullWidth
                        margin="dense"
                        label="Цена"
                        type="number"
                        name="price"
                        placeholder="0"
                        value={formDataEvent.price || ""}
                        onChange={handleChangeEvent}
                    />
                    <TextField
                        fullWidth
                        margin="dense"
                        label="Вместимость"
                        type="number"
                        name="capacity"
                        placeholder="0"
                        value={formDataEvent.capacity || ""}
                        onChange={handleChangeEvent}
                    />
                    {/* Ползунок для возраста */}
                    <Box sx={{ mt: 2 }}>
                        <Typography variant="body1" gutterBottom>
                            Возраст: {formDataEvent.age}+
                        </Typography>
                        <Slider
                            value={formDataEvent.age || 0}
                            onChange={(e, newValue) => setFormDataEvent((prev) => ({ ...prev, age: newValue }))}
                            min={0}
                            max={60}
                            step={1}
                            marks={[
                                { value: 0, label: "0" },
                                { value: 60, label: "60+" },
                            ]}
                            valueLabelDisplay="auto"
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleSaveEvent} variant="contained" color="primary">
                        Сохранить
                    </Button>
                    <Button onClick={() => setEventModalOpen(false)} variant="outlined" color="secondary">
                        Отмена
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

// Функция для загрузки профиля организатора
async function getOrganizerProfile(username) {
    const token = localStorage.getItem("token");
    if (!token) {
        console.error("Токен отсутствует в localStorage");
        return null;
    }

    const response = await fetch(`http://localhost:8722/api/v1/organizer/username/${username}`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    });

    if (!response.ok) {
        console.error(`Ошибка получения профиля: ${response.status}`);
        return null;
    }

    return await response.json();
}

export default EventsPage;