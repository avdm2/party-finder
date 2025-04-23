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
    CircularProgress,
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
                        <GradientButton
                            variant="contained"
                            onClick={handleOpenRatingModal}
                            sx={{ mt: 3 }}
                        >
                            Оценить организатора
                        </GradientButton>
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