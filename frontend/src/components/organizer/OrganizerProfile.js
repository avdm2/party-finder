import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    Button,
    Avatar,
    Box,
    Typography,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    TextField,
    DialogActions,
    Rating,
} from "@mui/material";
import { PhotoCamera } from "@mui/icons-material";
import { sendRating } from "../../api/ApiOrganizerProfile";
import { getProfileByUsernameOrganizer, getProfileMe } from "../../api/ApiOrganizerProfile";

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

    useEffect(() => {
        const fetchProfile = async () => {
            const token = localStorage.getItem("token");
            if (!token) return navigate("/login");
            const payload = JSON.parse(atob(token.split(".")[1]));
            let data;
            if (username === "me") {
                console.log(username)
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
            console.log("Фото успешно загружено!");
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

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/home");
    };

    const handleOpenRatingModal = () => {
        setIsRatingModalOpen(true);
    };

    const handleCloseRatingModal = () => {
        setIsRatingModalOpen(false);
        setRatingValue(1);
        setRatingComment("");
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

    return (
        <Box
            sx={{
                maxWidth: 600,
                margin: "auto",
                textAlign: "center",
                p: 3,
                bgcolor: "background.paper",
                borderRadius: 2,
                boxShadow: 3,
            }}
        >
            {profile ? (
                <>
                    <Avatar
                        src={profile.media ? `data:image/jpeg;base64,${profile.media.fileData}` : ""}
                        sx={{ width: 120, height: 120, margin: "auto", bgcolor: "grey.300" }}
                    >
                        {!profile.media && <PhotoCamera fontSize="large" />}
                    </Avatar>
                    {username === "me" && (
                        <IconButton component="label">
                            <input hidden accept="image/*" type="file" onChange={handleAvatarChange} />
                            <PhotoCamera />
                        </IconButton>
                    )}
                    <Typography variant="h5">{profile.name} {profile.surname}</Typography>
                    <Typography variant="body2" color="textSecondary">
                        Логин: {profile.username ?? "Неизвестно"}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                        Рейтинг: {rating !== null ? rating : "Неизвестно..."}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                        Дата рождения: {new Date(profile.birthday).toLocaleDateString("ru-RU")}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                        UUID: {profile.id}
                    </Typography>
                    {username !== "me" && (
                        <Button variant="contained" color="primary" onClick={handleOpenRatingModal} style={{ marginTop: 16 }}>
                            Оценить организатора
                        </Button>
                    )}
                </>
            ) : (
                <Typography variant="body1">Загрузка...</Typography>
            )}
            <Dialog open={modalOpen} onClose={() => setModalOpen(false)}>
                <DialogTitle>Заполните профиль</DialogTitle>
                <DialogContent>
                    <TextField fullWidth margin="dense" label="Имя" name="name" onChange={handleChange} />
                    <TextField fullWidth margin="dense" label="Фамилия" name="surname" onChange={handleChange} />
                    <TextField
                        fullWidth
                        margin="dense"
                        type="date"
                        name="birthday"
                        onChange={handleChange}
                        InputLabelProps={{ shrink: true }}
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
                <DialogActions>
                    <Button onClick={handleSubmit} variant="contained" color="primary">
                        Сохранить
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog open={isRatingModalOpen} onClose={handleCloseRatingModal}>
                <DialogTitle>Оцените организатора</DialogTitle>
                <DialogContent>
                    <Rating
                        name="simple-controlled"
                        value={ratingValue}
                        onChange={handleRatingChange}
                    />
                    <TextField
                        fullWidth
                        margin="dense"
                        label="Комментарий"
                        multiline
                        rows={4}
                        value={ratingComment}
                        onChange={handleRatingCommentChange}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleSubmitRating} variant="contained" color="primary">
                        Отправить
                    </Button>
                    <Button onClick={handleCloseRatingModal} variant="outlined" color="secondary">
                        Закрыть
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

export async function createOrganizerProfile(profileData) {
    const token = localStorage.getItem("token");
    console.log(profileData)
    const response = await fetch("http://localhost:8722/api/v1/organizer", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(profileData),
    });
    return response.ok;
}

export default OrganizerProfile;