import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    Typography,
    IconButton,
    Dialog,
    DialogContent,
    TextField,
    DialogActions,
    Rating,
    Box,
    CircularProgress, Button, DialogTitle,
} from "@mui/material";
import { PhotoCamera } from "@mui/icons-material";
import { sendRating } from "../../api/ApiOrganizerProfile";
import { getProfileByUsernameOrganizer, getProfileMe } from "../../api/ApiOrganizerProfile";
import {
    ProfileContainer,
    StyledAvatar,
    GradientButton,
    StyledDialog,
    DialogTitleStyled,
    SubmitButton,
    CancelButton,
    LoadingContainer,
} from "../../styles/OrganizerProfile.styles.js";

function OrganizerProfile() {
    const { username } = useParams();
    const [profile, setProfile] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [formData, setFormData] = useState({ name: "", surname: "", birthday: "", username: "" });
    const [avatarFile, setAvatarFile] = useState(null);
    const [ratingValue, setRatingValue] = useState(1);
    const [ratingComment, setRatingComment] = useState("");
    const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
    const navigate = useNavigate();
    const [rating, setRating] = useState(null);
    const [events, setEvents] = useState([]);
    const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [completedEvents, setCompletedEvents] = useState([]);
    const [cancelledEvents, setCancelledEvents] = useState([]);
    const [upcomingEvents, setUpcomingEvents] = useState([]);

    useEffect(() => {
        const fetchProfile = async () => {
            const token = localStorage.getItem("token");
            if (!token) return navigate("/login");
            const payload = JSON.parse(atob(token.split(".")[1]));
            let data;
            if (username === "me") {
                try {
                    data = await getProfileMe();
                } catch (error) {
                    setFormData((prev) => ({ ...prev, username: payload.sub }));
                    setModalOpen(true);
                }
            } else {
                data = await getProfileByUsernameOrganizer(username);
            }
            if (data) {
                setProfile(data);
                if (data.id) {
                    await fetchRating(data.id);
                }
            }
        };

        fetchProfile();
    }, [navigate, username]);

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setAvatarFile(file);
            uploadAvatar(file);
        }
    };

    const [feedbackFormData, setFeedbackFormData] = useState({
        avgBill: "",
        avgAge: "",
        avgTravelTimeInMinutes: "",
        rate: 1,
        peopleInGroup: "",
        avgSpentTimeInMinutes: "",
    });

    const [errors, setErrors] = useState({});

    const uploadAvatar = async (file) => {
        const token = localStorage.getItem("token");
        const formData = new FormData();
        formData.append("file", file);
        try {
            const response = await fetch(
                `http://localhost:8722/api/v1/organizer/media/uploadPhoto?username=${profile.username}`,
                {
                    method: "POST",
                    body: formData,
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            if (!response.ok) {
                const errorText = await response.text();
                console.error("Ошибка загрузки:", errorText);
                alert(`Ошибка загрузки: ${errorText}`);
                return;
            }
            const updatedProfile = await getProfileByUsernameOrganizer(profile.username);
            if (updatedProfile.media) {
                setProfile((prevProfile) => ({ ...prevProfile, media: updatedProfile.media }));
            }
        } catch (error) {
            console.error("Ошибка при загрузке фото:", error);
            alert("Ошибка при загрузке фото: " + error.message);
        }
    };

    const fetchRating = async (organizerId) => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`http://localhost:8725/api/v1/ratingSystem/organizer/${organizerId}`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });

            if (response.ok) {
                const data = await response.json();
                setRating(parseFloat(data).toFixed(1));
            }
        } catch (error) {
            console.error("Ошибка загрузки рейтинга:", error);
        }
    };

    const handleSubmit = async () => {
        const formattedData = { ...formData, birthday: `${formData.birthday}T00:00:00` };
        if (await createOrganizerProfile(formattedData)) {
            const updatedProfile = await getProfileByUsernameOrganizer(formData.username);
            setProfile(updatedProfile);
            setModalOpen(false);
            navigate("")
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleOpenRatingModal = () => {
        setIsRatingModalOpen(true);
    };

    const handleCloseRatingModal = () => {
        setIsRatingModalOpen(false);
        setRatingValue(1);
        setRatingComment("");
    };

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const token = localStorage.getItem("token");
                const data = await getProfileByUsernameOrganizer(username);
                const response = await fetch(
                    `http://localhost:8722/api/organizers/event/list/${data.id}`,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );
                if (response.ok) {
                    const data = await response.json();
                    setEvents(data);

                    const completed = data.filter((event) => event.status === "COMPLETED");
                    const cancelled = data.filter((event) => event.status === "CANCELLED");
                    const upcoming = data.filter((event) => event.status === "UPCOMING");

                    setCompletedEvents(completed);
                    setCancelledEvents(cancelled);
                    setUpcomingEvents(upcoming);
                }
            } catch (err) {
                console.error("Ошибка загрузки мероприятий:", err);
            }
        };
        fetchEvents();
    }, [username]);

    const fetchEvents = async (organizerId) => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`http://localhost:8722/api/v1/event/list/${organizerId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (response.ok) {
                const data = await response.json();
                setEvents(data);

                const completed = data.filter((event) => event.status === "COMPLETED");
                const cancelled = data.filter((event) => event.status === "CANCELLED");
                const upcoming = data.filter((event) => event.status === "UPCOMING");

                setCompletedEvents(completed);
                setCancelledEvents(cancelled);
                setUpcomingEvents(upcoming);
            }
        } catch (error) {
            console.error("Ошибка загрузки мероприятий:", error);
        }
    };

    const handleFeedbackClick = (event) => {
        setSelectedEvent(event);
        setFeedbackModalOpen(true);
    };

    const handleCloseFeedbackModal = () => {
        setSelectedEvent(null);
        setFeedbackModalOpen(false);
    };

    const handleRatingChange = (event, newValue) => {
        setRatingValue(newValue);
    };

    const handleRatingCommentChange = (event) => {
        setRatingComment(event.target.value);
    };

    const handleSubmitRating = async () => {
        try {
            const token = localStorage.getItem("token");
            await sendRating(profile.id, ratingValue, ratingComment, token);
            await fetchRating(profile.id);
            alert("Оценка успешно отправлена!");
            handleCloseRatingModal();
        } catch (error) {
            console.error("Ошибка при отправке оценки:", error);
            alert("Произошла ошибка при отправке оценки.");
        }
    };

    const handleLoyaltyClick = () => {
        navigate(`/loyalty/organizer/${profile.id}`);
    };

    const handleFeedbackChange = (e) => {
        const { name, value } = e.target;
        setFeedbackFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleRateChange = (event, newValue) => {
        setFeedbackFormData((prev) => ({ ...prev, rate: newValue }));
    };

    const validateForm = () => {
        const newErrors = {};
        const {
            avgBill,
            avgAge,
            avgTravelTimeInMinutes,
            rate,
            peopleInGroup,
            avgSpentTimeInMinutes,
        } = feedbackFormData;

        if (avgBill < 0 || avgBill > 1_000_000) {
            newErrors.avgBill = "Значение должно быть от 0 до 1 000 000";
        }
        if (avgAge < 0 || avgAge > 80) {
            newErrors.avgAge = "Значение должно быть от 0 до 80";
        }
        if (avgTravelTimeInMinutes < 1 || avgTravelTimeInMinutes > 24 * 60) {
            newErrors.avgTravelTimeInMinutes = "Значение должно быть от 1 до 1440 минут";
        }
        if (rate < 1 || rate > 5) {
            newErrors.rate = "Значение должно быть от 1 до 5";
        }
        if (peopleInGroup < 1 || peopleInGroup > 20) {
            newErrors.peopleInGroup = "Значение должно быть от 1 до 20";
        }
        if (avgSpentTimeInMinutes < 1 || avgSpentTimeInMinutes > 24 * 60) {
            newErrors.avgSpentTimeInMinutes = "Значение должно быть от 1 до 1440 минут";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmitFeedback = async () => {
        if (!validateForm()) return;

        try {
            const token = localStorage.getItem("token");
            const payload = {
                eventId: selectedEvent.id,
                avgBill: parseInt(feedbackFormData.avgBill),
                avgAge: parseInt(feedbackFormData.avgAge),
                avgTravelTimeInMinutes: parseInt(feedbackFormData.avgTravelTimeInMinutes),
                rate: feedbackFormData.rate,
                peopleInGroup: parseInt(feedbackFormData.peopleInGroup),
                avgSpentTimeInMinutes: parseInt(feedbackFormData.avgSpentTimeInMinutes),
            };

            const response = await fetch("http://localhost:8722/api/organizers/analytics/add-data", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                alert("Фидбек успешно отправлен!");
                handleCloseFeedbackModal();
            } else {
                alert("Ошибка при отправке фидбека.");
            }
        } catch (error) {
            console.error("Ошибка:", error);
            alert("Произошла ошибка при отправке фидбека.");
        }
    };

    return (
        <ProfileContainer>
            {profile ? (
                <>
                    <StyledAvatar
                        src={profile.media ? `data:image/jpeg;base64,${profile.media.fileData}` : ""}
                    >
                        {!profile.media && <PhotoCamera fontSize="large" />}
                    </StyledAvatar>
                    {username === "me" && (
                        <IconButton component="label" sx={{ mt: 2 }}>
                            <input hidden accept="image/*" type="file" onChange={handleAvatarChange} />
                            <PhotoCamera />
                        </IconButton>
                    )}
                    <Typography variant="h5" sx={{ mt: 2, color: "#2c3e50", fontWeight: 700 }}>
                        {profile.name} {profile.surname}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#6a11cb", fontWeight: 500, mt: 0 }}>
                        Логин: {profile.username ?? "Неизвестно"}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#6a11cb", fontWeight: 500, mt: 0 }}>
                        Рейтинг: {rating !== null ? rating : "N/A"}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#6a11cb", fontWeight: 500, mt: 0 }}>
                        Дата рождения: {new Date(profile.birthday).toLocaleDateString("ru-RU")}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#6a11cb", fontWeight: 500, mt: 0 }}>
                        UUID: {profile.id}
                    </Typography>
                {username !== "me" && (
                    <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                        <GradientButton
                            variant="contained"
                            onClick={handleOpenRatingModal}
                            sx={{ mr: 4 }}
                        >
                            Оценить организатора
                        </GradientButton>
                        <GradientButton
                            variant="contained"
                            onClick={handleLoyaltyClick}
                            sx={{ ml: 4 }}
                        >
                            Лояльность
                        </GradientButton>
                    </Box>
                )}
                </>
            ) : (
                <LoadingContainer>
                    <CircularProgress sx={{ color: "#6a11cb" }} />
                </LoadingContainer>
            )}

            <StyledDialog open={modalOpen} onClose={() => setModalOpen(false)}>
                <DialogTitleStyled>Заполните профиль</DialogTitleStyled>
                <DialogContent>
                    <TextField
                        fullWidth
                        margin="dense"
                        label="Имя"
                        name="name"
                        onChange={handleChange}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        fullWidth
                        margin="dense"
                        label="Фамилия"
                        name="surname"
                        onChange={handleChange}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        fullWidth
                        margin="dense"
                        type="date"
                        name="birthday"
                        onChange={handleChange}
                        InputLabelProps={{ shrink: true }}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        fullWidth
                        margin="dense"
                        label="Логин"
                        name="username"
                        value={formData.username}
                        InputProps={{ readOnly: true }}
                    />
                </DialogContent>
                <DialogActions sx={{ justifyContent: "center" }}>
                    <SubmitButton onClick={handleSubmit}>
                        Сохранить
                    </SubmitButton>
                </DialogActions>
            </StyledDialog>

            <StyledDialog open={isRatingModalOpen} onClose={handleCloseRatingModal}>
                <DialogTitleStyled>Оцените организатора</DialogTitleStyled>
                <DialogContent>
                    <Box sx={{ display: "flex", justifyContent: "center", my: 3 }}>
                        <Rating
                            name="simple-controlled"
                            value={ratingValue}
                            onChange={handleRatingChange}
                            size="large"
                            sx={{
                                "& .MuiRating-icon": {
                                    color: "#ffcc00",
                                    fontSize: "2.5rem",
                                },
                                "& .MuiRating-iconFilled": {
                                    color: "#ffcc00",
                                },
                                "& .MuiRating-iconHover": {
                                    color: "#ffdd33",
                                },
                            }}
                        />
                    </Box>
                    <TextField
                        fullWidth
                        margin="dense"
                        label="Комментарий"
                        multiline
                        rows={4}
                        value={ratingComment}
                        onChange={handleRatingCommentChange}
                        sx={{
                            mb: 2,
                            "& .MuiOutlinedInput-root": {
                                borderRadius: "10px",
                                "&.Mui-focused fieldset": {
                                    borderColor: "#6a11cb",
                                    boxShadow: "0 0 0 3px rgba(106, 17, 203, 0.1)",
                                },
                            },
                        }}
                    />
                </DialogContent>
                <DialogActions sx={{ justifyContent: "center" }}>
                    <CancelButton onClick={handleCloseRatingModal} sx={{ mr: 2 }}>
                        Закрыть
                    </CancelButton>
                    <SubmitButton onClick={handleSubmitRating}>
                        Отправить
                    </SubmitButton>
                </DialogActions>
            </StyledDialog>
            <Box sx={{ mt: 4 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                    Мероприятия организатора
                </Typography>

                <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                        Завершенные мероприятия
                    </Typography>
                    {completedEvents.length > 0 ? (
                        <div className="events-grid">
                            {completedEvents.map((event) => (
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
                                            {event.address}
                                        </Typography>
                                        <Typography variant="body2" className="event-description">
                                            {event.description}
                                        </Typography>
                                        <Button
                                            onClick={() => handleFeedbackClick(event)}
                                            variant="contained"
                                            color="primary"
                                            size="small"
                                            sx={{ mt: 1 }}
                                        >
                                            Дать фидбек
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <Typography>Завершенных мероприятий нет.</Typography>
                    )}
                </Box>

                <Box sx={{ mt: 4 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                        Отмененные мероприятия
                    </Typography>
                    {cancelledEvents.length > 0 ? (
                        <div className="events-grid">
                            {cancelledEvents.map((event) => (
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
                                            {event.address}
                                        </Typography>
                                        <Typography variant="body2" className="event-description">
                                            {event.description}
                                        </Typography>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <Typography>Отмененных мероприятий нет.</Typography>
                    )}
                </Box>

                <Box sx={{ mt: 4 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                        Предстоящие мероприятия
                    </Typography>
                    {upcomingEvents.length > 0 ? (
                        <div className="events-grid">
                            {upcomingEvents.map((event) => (
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
                                            {event.address}
                                        </Typography>
                                        <Typography variant="body2" className="event-description">
                                            {event.description}
                                        </Typography>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <Typography>Предстоящих мероприятий нет.</Typography>
                    )}
                </Box>

                <Dialog open={feedbackModalOpen} onClose={handleCloseFeedbackModal}>
                    <DialogTitle>Оставить фидбек</DialogTitle>
                    <DialogContent>
                        <Typography variant="h6">{selectedEvent?.title}</Typography>

                        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                            <Typography variant="body1" sx={{ mr: 2 }}>
                                Рейтинг:
                            </Typography>
                            <Rating
                                name="rate"
                                value={feedbackFormData.rate}
                                onChange={handleRateChange}
                                size="large"
                                sx={{
                                    "& .MuiRating-icon": {
                                        color: "#ffcc00",
                                        fontSize: "2rem",
                                    },
                                    "& .MuiRating-iconFilled": {
                                        color: "#ffcc00",
                                    },
                                    "& .MuiRating-iconHover": {
                                        color: "#ffdd33",
                                    },
                                }}
                            />
                        </Box>

                        <TextField
                            fullWidth
                            margin="dense"
                            label="Средний чек (от 0 до 1 000 000)"
                            name="avgBill"
                            type="number"
                            value={feedbackFormData.avgBill}
                            onChange={handleFeedbackChange}
                            error={!!errors.avgBill}
                            helperText={errors.avgBill}
                            sx={{ mb: 2 }}
                        />

                        <TextField
                            fullWidth
                            margin="dense"
                            label="Средний возраст (от 0 до 80)"
                            name="avgAge"
                            type="number"
                            value={feedbackFormData.avgAge}
                            onChange={handleFeedbackChange}
                            error={!!errors.avgAge}
                            helperText={errors.avgAge}
                            sx={{ mb: 2 }}
                        />

                        <TextField
                            fullWidth
                            margin="dense"
                            label="Среднее время в пути (в минутах, от 1 до 1440)"
                            name="avgTravelTimeInMinutes"
                            type="number"
                            value={feedbackFormData.avgTravelTimeInMinutes}
                            onChange={handleFeedbackChange}
                            error={!!errors.avgTravelTimeInMinutes}
                            helperText={errors.avgTravelTimeInMinutes}
                            sx={{ mb: 2 }}
                        />

                        <TextField
                            fullWidth
                            margin="dense"
                            label="Количество людей в группе (от 1 до 20)"
                            name="peopleInGroup"
                            type="number"
                            value={feedbackFormData.peopleInGroup}
                            onChange={handleFeedbackChange}
                            error={!!errors.peopleInGroup}
                            helperText={errors.peopleInGroup}
                            sx={{ mb: 2 }}
                        />

                        <TextField
                            fullWidth
                            margin="dense"
                            label="Среднее время на мероприятии (в минутах, от 1 до 1440)"
                            name="avgSpentTimeInMinutes"
                            type="number"
                            value={feedbackFormData.avgSpentTimeInMinutes}
                            onChange={handleFeedbackChange}
                            error={!!errors.avgSpentTimeInMinutes}
                            helperText={errors.avgSpentTimeInMinutes}
                            sx={{ mb: 2 }}
                        />

                        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
                            <Button onClick={handleCloseFeedbackModal} variant="outlined" color="secondary">
                                Отмена
                            </Button>
                            <Button onClick={handleSubmitFeedback} variant="contained" color="primary">
                                Отправить
                            </Button>
                        </Box>
                    </DialogContent>
                </Dialog>
            </Box>
        </ProfileContainer>
    );
}

export async function createOrganizerProfile(profileData) {
    const token = localStorage.getItem("token");
    const response = await fetch("http://localhost:8722/api/v1/organizer", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(profileData),
    });
    return response.ok;
}

export default OrganizerProfile;