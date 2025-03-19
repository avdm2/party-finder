import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Avatar, Box, Typography, IconButton } from "@mui/material";
import { PhotoCamera } from "@mui/icons-material";

function OrganizerProfile() {
    const [profile, setProfile] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [formData, setFormData] = useState({ name: "", surname: "", birthday: "", username: "" });
    const [avatarFile, setAvatarFile] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) return navigate("/login");

        const payload = JSON.parse(atob(token.split(".")[1]));
        if (!payload.roles.includes("ORGANIZER")) return navigate("/homepage");

        getOrganizerProfile(payload.sub).then(data => {
            if (data) {
                setProfile(data);
            } else {
                setFormData(prev => ({ ...prev, username: payload.sub }));
                setModalOpen(true);
            }
        });
    }, [navigate]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        const formattedData = { ...formData, birthday: `${formData.birthday}T00:00:00` };
        if (await createOrganizerProfile(formattedData)) {
            const updatedProfile = await getOrganizerProfile(formData.username);
            setProfile(updatedProfile);
            setModalOpen(false);
        }
    };

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
            const response = await fetch(`http://localhost:8722/api/v1/organizer/media/uploadPhoto?username=${profile.username}`, {
                method: "POST",
                body: formData,
                headers: { Authorization: `Bearer ${token}` },
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
                setProfile(prevProfile => ({ ...prevProfile, media: updatedProfile.media }));
            }
        } catch (error) {
            console.error("Ошибка при загрузке фото:", error);
            alert("Ошибка при загрузке фото: " + error.message);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    return (
        <Box sx={{ maxWidth: 400, margin: "auto", textAlign: "center", p: 3, bgcolor: "background.paper", borderRadius: 2, boxShadow: 3 }}>
            {profile ? (
                <>
                    <Avatar
                        src={profile.media ? `data:image/jpeg;base64,${profile.media.fileData}` : ""}
                        sx={{ width: 120, height: 120, margin: "auto", bgcolor: "grey.300" }}
                    >
                        {!profile.media && <PhotoCamera fontSize="large" />}
                    </Avatar>
                    <IconButton component="label">
                        <input hidden accept="image/*" type="file" onChange={handleAvatarChange} />
                        <PhotoCamera />
                    </IconButton>
                    <Typography variant="h5">{profile.name} {profile.surname}</Typography>
                    <Typography variant="body2" color="textSecondary">
                        Дата рождения: {new Date(profile.birthday).toLocaleDateString("ru-RU")}
                    </Typography>
                    <Button variant="contained" color="secondary" onClick={handleLogout} sx={{ mt: 2 }}>
                        Выйти
                    </Button>
                </>
            ) : (
                <Typography variant="body1">Загрузка...</Typography>
            )}

            <Dialog open={modalOpen} onClose={() => setModalOpen(false)}>
                <DialogTitle>Заполните профиль</DialogTitle>
                <DialogContent>
                    <TextField fullWidth margin="dense" label="Имя" name="name" onChange={handleChange} />
                    <TextField fullWidth margin="dense" label="Фамилия" name="surname" onChange={handleChange} />
                    <TextField fullWidth margin="dense" type="date" name="birthday" onChange={handleChange} InputLabelProps={{ shrink: true }} />
                    <TextField fullWidth margin="dense" label="Логин" name="username" value={formData.username} InputProps={{ readOnly: true }} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleSubmit} variant="contained" color="primary">Сохранить</Button>
                    <Button onClick={() => setModalOpen(false)} variant="outlined" color="secondary">Отмена</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

export async function createOrganizerProfile(profileData) {
    const token = localStorage.getItem("token");
    const response = await fetch("http://localhost:8722/api/v1/organizer", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
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
        headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
    });

    if (!response.ok) {
        console.error(`Ошибка получения профиля: ${response.status}`);
        return null;
    }

    return await response.json();
}

export default OrganizerProfile;
