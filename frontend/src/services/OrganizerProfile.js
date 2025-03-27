import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    Avatar,
    Box,
    Typography,
    IconButton,
    Grid,
    Paper
} from "@mui/material";
import {PhotoCamera, Edit} from "@mui/icons-material";

function OrganizerProfile() {
    const [profile, setProfile] = useState(null);
    const [events, setEvents] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [formData, setFormData] = useState({name: "", surname: "", birthday: "", username: ""});
    const [avatarFile, setAvatarFile] = useState(null);
    const navigate = useNavigate();

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

    const handleOpenEventModal = (event = null) => {
        console.log("Открытие модального окна для мероприятия", event);
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

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) return navigate("/login");

        const payload = JSON.parse(atob(token.split(".")[1]));
        if (!payload.roles.includes("ORGANIZER")) return navigate("/homepage");

        getOrganizerProfile(payload.sub).then(data => {
            if (data) {
                setProfile(data);
                fetchEvents(data.id);
            } else {
                setFormData(prev => ({...prev, username: payload.sub}));
                setModalOpen(true);
            }
        });
    }, [navigate]);

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setAvatarFile(file);
            uploadAvatar(file);
        }
    };

    const uploadAvatar = async (file) => {
        if (!profile?.username) {
            console.error("Ошибка: profile.username отсутствует");
            return;
        }

        const token = localStorage.getItem("token");
        if (!token) {
            console.error("Ошибка: отсутствует токен авторизации");
            alert("Вы не авторизованы!");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await fetch(`http://localhost:8722/api/organizers/media/uploadPhoto?username=${profile.username}`, {
                method: "POST",
                body: formData,
                headers: {Authorization: `Bearer ${token}`},
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error("Ошибка загрузки:", errorText);
                alert(`Ошибка загрузки: ${errorText}`);
                return;
            }

            console.log("Фото успешно загружено!");
            const updatedProfile = await getOrganizerProfile(profile.username);
            if (updatedProfile.media) {
                setProfile(prevProfile => ({...prevProfile, media: updatedProfile.media}));
            }
        } catch (error) {
            console.error("Ошибка при загрузке фото:", error);
            alert("Ошибка при загрузке фото: " + error.message);
        }
    };

    const handleSubmit = async () => {
        const formattedData = { ...formData, birthday: `${formData.birthday}T00:00:00` };
        if (await createOrganizerProfile(formattedData)) {
            const updatedProfile = await getOrganizerProfile(formData.username);
            setProfile(updatedProfile);
            setModalOpen(false);
        }
    };

    const handleChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value});
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/homepage");
    };

    const handleCloseEventModal = () => {
        setEventModalOpen(false);
    };

    const handleChangeEvent = (e) => {
        setFormDataEvent(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleSaveEvent = async () => {
        const token = localStorage.getItem("token");
        const method = formDataEvent.id ? "PUT" : "POST";
        const url = formDataEvent.id
            ? `http://localhost:8722/api/organizers/event/update/${formDataEvent.id}`
            : "http://localhost:8722/api/organizers/event";

        // Преобразуем дату к формату yyyy-MM-dd'T'HH:mm:ss
        const formattedEventData = {
            ...formDataEvent,
            organizerId: profile.id,
            dateOfEvent: new Date(formDataEvent.dateOfEvent).toISOString().slice(0, 19).replace("T", "T"),
            status: "UPCOMING"
        };

        const response = await fetch(url, {
            method,
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(formattedEventData),
        });

        if (response.ok) {
            fetchEvents(profile.id);
            setEventModalOpen(false);
        } else {
            console.error("Ошибка сохранения мероприятия");
        }
    };


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

    const handleEditEvent = (eventId) => {
        window.open(`/edit-event?eventId=${eventId}`, "_blank");
    };

    const handleCancelEvent = async (eventId) => {
        const token = localStorage.getItem("token");
        const response = await fetch(`http://localhost:8722/api/organizers/event/cancel/${eventId}`, {
            method: "PUT",
            headers: {Authorization: `Bearer ${token}`},
        });

        if (response.ok) {
            setEvents(prevEvents => prevEvents.map(event => event.id === eventId ? {
                ...event,
                status: "CANCELLED"
            } : event));
        } else {
            console.error("Ошибка отмены мероприятия");
        }
    };

    const renderEventsByStatus = (status) => {
        const filteredEvents = events.filter(event => event.status === status);
        if (filteredEvents.length === 0) return null;

        return (
            <Box sx={{mt: 2}}>
                <Typography variant="h6">{status}</Typography>
                <Grid container spacing={2}>
                    {filteredEvents.map(event => (
                        <Grid item xs={12} key={event.id}>
                            <Paper sx={{p: 2, display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                                <Box>
                                    <Typography variant="h6">{event.title}</Typography>
                                    <Typography variant="body2">{event.description}</Typography>
                                    <Typography
                                        variant="body2">Дата: {new Date(event.dateOfEvent).toLocaleString("ru-RU")}</Typography>
                                    <Typography variant="body2">Адрес: {event.address}</Typography>
                                    <Typography variant="body2">Цена: {event.price} ₽</Typography>
                                    <Typography variant="body2">Вместимость: {event.capacity}</Typography>
                                    <Typography variant="body2">Возраст: {event.age}+</Typography>
                                </Box>
                                <Box>
                                    <IconButton onClick={() => handleEditEvent(event.id)}><Edit/></IconButton>
                                    {event.status === "UPCOMING" && (
                                        <Button color="error"
                                                onClick={() => handleCancelEvent(event.id)}>Отменить</Button>
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
        <Box sx={{
            maxWidth: 600,
            margin: "auto",
            textAlign: "center",
            p: 3,
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: 3
        }}>
            {profile ? (
                <>
                    <Avatar
                        src={profile.media ? `data:image/jpeg;base64,${profile.media.fileData}` : ""}
                        sx={{width: 120, height: 120, margin: "auto", bgcolor: "grey.300"}}
                    >
                        {!profile.media && <PhotoCamera fontSize="large"/>}
                    </Avatar>
                    <IconButton component="label">
                        <input hidden accept="image/*" type="file" onChange={handleAvatarChange}/>
                        <PhotoCamera/>
                    </IconButton>
                    <Typography variant="h5">{profile.name} {profile.surname}</Typography>
                    <Typography variant="body2" color="textSecondary">
                        Дата рождения: {new Date(profile.birthday).toLocaleDateString("ru-RU")}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                        UUID: {profile.id}
                    </Typography>

                    <Box sx={{ display: "flex", gap: 4, justifyContent: "center" }}>
                        <Button
                            variant="contained"
                            color="secondary"
                            onClick={() => handleOpenEventModal()}
                            sx={{ mt: 2 }}
                        >
                            Создать мероприятие
                        </Button>


                    </Box>

                    {["COMPLETED", "CANCELLED", "ONGOING", "UPCOMING"].map(status => renderEventsByStatus(status))}
                </>
            ) : (
                <Typography variant="body1">Загрузка...</Typography>
            )}

            {/* Диалог для заполнения профиля */}
            <Dialog open={modalOpen} onClose={() => setModalOpen(false)}>
                <DialogTitle>Заполните профиль</DialogTitle>
                <DialogContent>
                    <TextField fullWidth margin="dense" label="Имя" name="name" onChange={handleChange}/>
                    <TextField fullWidth margin="dense" label="Фамилия" name="surname" onChange={handleChange}/>
                    <TextField fullWidth margin="dense" type="date" name="birthday" onChange={handleChange}
                               InputLabelProps={{shrink: true}}/>
                    <TextField fullWidth margin="dense" label="Логин" name="username" value={formData.username}
                               InputProps={{readOnly: true}}/>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleSubmit} variant="contained" color="primary">Сохранить</Button>
                    <Button onClick={() => setModalOpen(false)} variant="outlined" color="secondary">Отмена</Button>
                </DialogActions>
            </Dialog>

            {/* Диалог для создания/редактирования мероприятия */}
            <Dialog open={eventModalOpen} onClose={handleCloseEventModal}>
                <DialogTitle>{formDataEvent.id ? "Редактировать мероприятие" : "Создать мероприятие"}</DialogTitle>
                <DialogContent>
                    <TextField fullWidth margin="dense" label="UUID создателя" name="owner_uuid" value={profile ? profile.id : "empty"}
                               InputProps={{readOnly: true}}/>
                    <TextField fullWidth margin="dense" label="Название" name="title" value={formDataEvent.title}
                               onChange={handleChangeEvent}/>
                    <TextField fullWidth margin="dense" label="Описание" name="description" value={formDataEvent.description}
                               onChange={handleChangeEvent}/>
                    <TextField
                        fullWidth
                        margin="dense"
                        type="datetime-local"
                        name="dateOfEvent"
                        value={formDataEvent.dateOfEvent}
                        onChange={handleChangeEvent}
                        InputLabelProps={{ shrink: true }}
                    />

                    <TextField fullWidth margin="dense" label="Адрес" name="address" value={formDataEvent.address}
                               onChange={handleChangeEvent}/>
                    <TextField fullWidth margin="dense" label="Цена" type="number" name="price" value={formDataEvent.price}
                               onChange={handleChangeEvent}/>
                    <TextField fullWidth margin="dense" label="Вместимость" type="number" name="capacity"
                               value={formDataEvent.capacity} onChange={handleChangeEvent}/>
                    <TextField fullWidth margin="dense" label="Возраст" type="number" name="age" value={formDataEvent.age}
                               onChange={handleChangeEvent}/>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleSaveEvent} variant="contained" color="primary">Сохранить</Button>
                    <Button onClick={handleCloseEventModal} variant="outlined" color="secondary">Отмена</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );

}

export async function createOrganizerProfile(profileData) {
    const token = localStorage.getItem("token");
    const response = await fetch("http://localhost:8722/api/v1/organizer", {
        method: "POST",
        headers: {"Content-Type": "application/json", "Authorization": `Bearer ${token}`},
        body: JSON.stringify(profileData)
    });
    return response.ok;
}

export async function getOrganizerProfile(username) {
    const token = localStorage.getItem("token");
    if (!token) {
        console.error("Токен отсутствует в localStorage");
        return null;
    }

    const response = await fetch(`http://localhost:8722/api/v1/organizer/username/${username}`, {
        method: "GET",
        headers: {"Authorization": `Bearer ${token}`, "Content-Type": "application/json"},
    });

    if (!response.ok) {
        console.error(`Ошибка получения профиля: ${response.status}`);
        return null;
    }

    return await response.json();
}

export default OrganizerProfile;
