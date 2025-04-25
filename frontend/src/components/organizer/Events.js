import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {
    TextField,
    DialogContent,
    DialogActions,
    IconButton,
    Grid,
    Slider,
    CircularProgress,
    Typography,
    Box,
    Accordion,
    AccordionSummary,
    AccordionDetails,
} from "@mui/material";
import {Edit, ExpandMore} from "@mui/icons-material";
import {
    EventsContainer,
    EventPaper,
    CreateEventButton,
    StyledAccordion,
    StyledDialog,
    DialogTitleStyled,
    SubmitButton,
    CancelButton,
    CompleteButton,
    EventDetails,
    EventTitle,
    EventInfo,
    EventImagePlaceholder,
    EventActions,
    EventsGrid,
    EventCard,
    EventImageContainer,
} from "../../styles/EventsPage.styles.js";
import {getOrganizerProfile} from "../../api/ApiOrganizerProfile";

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
    const [profile, setProfile] = useState(null);
    const navigate = useNavigate();

    const statusTranslations = {
        UPCOMING: "Предстоящие",
        COMPLETED: "Завершенные",
        CANCELLED: "Отмененные",
    };

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) return navigate("/login");

        const payload = JSON.parse(atob(token.split(".")[1]));
        if (!payload.roles.includes("ORGANIZER")) return navigate("/home");

        getOrganizerProfile(payload.sub).then((data) => {
            if (data) {
                setProfile(data);
                fetchEvents(data.id);
            } else {
                navigate("/home");
            }
        });
    }, [navigate]);

    const fetchEvents = async (organizerId) => {
        const token = localStorage.getItem("token");
        const response = await fetch(
            `http://localhost:8722/api/organizers/event/list/${organizerId}`,
            {
                method: "GET",
                headers: {Authorization: `Bearer ${token}`},
            }
        );

        if (response.ok) {
            const data = await response.json();
            setEvents(data);
        } else {
            console.error("Ошибка загрузки мероприятий");
        }
    };

    const handleOpenEventModal = (event = null) => {
        if (event) {
            setFormDataEvent({...event});
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
        maxDate.setFullYear(currentDate.getFullYear() + 2);

        if (eventDate > maxDate) {
            alert("Дата мероприятия не может быть позже чем через 2 года.");
            return;
        }

        const formattedEventData = {
            ...formDataEvent,
            organizerId: profile?.id,
            dateOfEvent: eventDate.toISOString().slice(0, 19).replace("T", "T"),
            status: "UPCOMING",
            rating: 0,
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
            fetchEvents(profile?.id);
            setEventModalOpen(false);
        } else {
            console.error("Ошибка сохранения мероприятия");
        }
    };

    const handleEditEvent = async (eventId) => {
        const token = localStorage.getItem("token");
        const response = await fetch(
            `http://localhost:8722/api/organizers/event/${eventId}`,
            {
                method: "GET",
                headers: {Authorization: `Bearer ${token}`},
            }
        );

        if (response.ok) {
            const eventData = await response.json();
            setFormDataEvent({
                id: eventData.id,
                title: eventData.title,
                description: eventData.description,
                dateOfEvent: new Date(eventData.dateOfEvent).toISOString().slice(0, 16),
                address: eventData.address,
                price: eventData.price,
                capacity: eventData.capacity,
                age: eventData.age,
            });
            setEventModalOpen(true);
        } else {
            console.error("Ошибка загрузки данных мероприятия");
        }
    };

    const handleCancelEvent = async (eventId) => {
        const token = localStorage.getItem("token");
        const response = await fetch(
            `http://localhost:8722/api/organizers/event/cancel/${eventId}`,
            {
                method: "PUT",
                headers: {Authorization: `Bearer ${token}`},
            }
        );

        if (response.ok) {
            setEvents((prevEvents) =>
                prevEvents.map((event) =>
                    event.id === eventId ? {...event, status: "CANCELLED"} : event
                )
            );
        } else {
            console.error("Ошибка отмены мероприятия");
        }
    };

    const handleCompleteEvent = async (eventId) => {
        const token = localStorage.getItem("token");
        const response = await fetch(
            `http://localhost:8722/api/organizers/event/complete/${eventId}`,
            {
                method: "PUT",
                headers: {Authorization: `Bearer ${token}`},
            }
        );

        if (response.ok) {
            setEvents((prevEvents) =>
                prevEvents.map((event) =>
                    event.id === eventId ? {...event, status: "COMPLETED"} : event
                )
            );
        } else {
            console.error("Ошибка завершения мероприятия");
        }
    };

    const renderEventsByStatus = (status) => {
        const filteredEvents = events.filter((event) => event.status === status);

        return (
            <StyledAccordion defaultExpanded>
                <AccordionSummary expandIcon={<ExpandMore/>}>
                    <Typography variant="h6">
                        {statusTranslations[status]} ({filteredEvents.length})
                    </Typography>
                </AccordionSummary>
                <AccordionDetails>
                    {filteredEvents.length === 0 ? (
                        <Typography variant="body2" color="textSecondary">
                            Нет информации
                        </Typography>
                    ) : (
                        <div className="events-grid">
                            {filteredEvents.map((event) => (
                                <div key={event.id} className="event-card">
                                    <div className="event-image-container">
                                        {event.imageUrl ? (
                                            <img
                                                src={event.imageUrl}
                                                alt={event.title}
                                                className="event-image"
                                            />
                                        ) : (
                                            <div className="event-image-placeholder"></div>
                                        )}
                                    </div>
                                    <div className="event-details">
                                        <Typography variant="h6" className="event-title">
                                            {event.title}
                                        </Typography>
                                        <Typography variant="body2" className="event-date">
                                            {new Date(event.dateOfEvent).toLocaleString()}
                                        </Typography>
                                        <Typography variant="body2" className="event-location">
                                            Адрес: {event.address}
                                        </Typography>
                                        <Typography variant="body2" className="event-description">
                                            {event.description}
                                        </Typography>
                                        <Box sx={{
                                            display: 'flex',
                                            gap: 1,
                                            mt: 1,
                                            justifyContent: 'flex-end'
                                        }}>
                                            {["UPCOMING"].includes(event.status) && (
                                                <>
                                                    <IconButton
                                                        onClick={() => handleEditEvent(event.id)}
                                                        size="small"
                                                        sx={{ color: "#6a11cb" }}
                                                    >
                                                        <Edit/>
                                                    </IconButton>
                                                    <CompleteButton
                                                        size="small"
                                                        onClick={() => handleCompleteEvent(event.id)}
                                                    >
                                                        Завершить
                                                    </CompleteButton>
                                                    <CancelButton
                                                        size="small"
                                                        onClick={() => handleCancelEvent(event.id)}
                                                    >
                                                        Отменить
                                                    </CancelButton>
                                                </>
                                            )}
                                        </Box>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </AccordionDetails>
            </StyledAccordion>
        );
    };

    return (
        <EventsContainer>
            <Typography variant="h4" sx={{color: "#2c3e50", fontWeight: 700}}>
                Мои мероприятия
            </Typography>
            {profile ? (
                <>
                    <CreateEventButton
                        variant="contained"
                        onClick={() => handleOpenEventModal()}
                        sx={{
                            mt: 2
                        }}
                    >
                        Создать мероприятие
                    </CreateEventButton>
                    {["UPCOMING", "COMPLETED", "CANCELLED"].map((status) =>
                        renderEventsByStatus(status)
                    )}
                </>
            ) : (
                <Box sx={{display: "flex", justifyContent: "center", py: 4}}>
                    <CircularProgress sx={{color: "#6a11cb"}}/>
                </Box>
            )}

            <StyledDialog
                open={eventModalOpen}
                onClose={() => setEventModalOpen(false)}
            >
                <DialogTitleStyled>
                    {formDataEvent.id ? "Редактировать мероприятие" : "Создать мероприятие"}
                </DialogTitleStyled>
                <DialogContent>
                    <TextField
                        fullWidth
                        margin="dense"
                        label="UUID создателя"
                        name="owner_uuid"
                        value={profile?.id || "empty"}
                        InputProps={{readOnly: true}}
                        sx={{mb: 2}}
                    />
                    <TextField
                        fullWidth
                        margin="dense"
                        label="Название"
                        name="title"
                        value={formDataEvent.title}
                        onChange={handleChangeEvent}
                        sx={{mb: 2}}
                    />
                    <TextField
                        fullWidth
                        margin="dense"
                        label="Описание"
                        name="description"
                        value={formDataEvent.description}
                        onChange={handleChangeEvent}
                        sx={{mb: 2}}
                    />
                    <TextField
                        fullWidth
                        margin="dense"
                        type="datetime-local"
                        name="dateOfEvent"
                        value={formDataEvent.dateOfEvent}
                        onChange={handleChangeEvent}
                        InputLabelProps={{shrink: true}}
                        sx={{mb: 2}}
                    />
                    <TextField
                        fullWidth
                        margin="dense"
                        label="Адрес"
                        name="address"
                        value={formDataEvent.address}
                        onChange={handleChangeEvent}
                        sx={{mb: 2}}
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
                        sx={{mb: 2}}
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
                        sx={{mb: 2}}
                    />
                    <Box sx={{mt: 2}}>
                        <Typography variant="body1" gutterBottom sx={{color: "#2c3e50"}}>
                            Возраст: {formDataEvent.age}+
                        </Typography>
                        <Slider
                            value={formDataEvent.age || 0}
                            onChange={(e, newValue) =>
                                setFormDataEvent((prev) => ({...prev, age: newValue}))
                            }
                            min={0}
                            max={60}
                            step={1}
                            marks={[
                                {value: 0, label: "0"},
                                {value: 60, label: "60+"},
                            ]}
                            valueLabelDisplay="auto"
                            sx={{
                                color: "#6a11cb",
                                "& .MuiSlider-thumb": {
                                    "&:hover, &.Mui-focusVisible": {
                                        boxShadow: "0 0 0 8px rgba(106, 17, 203, 0.16)",
                                    },
                                },
                            }}
                        />
                    </Box>
                </DialogContent>
                <DialogActions sx={{justifyContent: "center"}}>
                    <SubmitButton onClick={handleSaveEvent}>Сохранить</SubmitButton>
                    <CancelButton onClick={() => setEventModalOpen(false)}>
                        Отмена
                    </CancelButton>
                </DialogActions>
            </StyledDialog>
        </EventsContainer>
    );
}

export default EventsPage;