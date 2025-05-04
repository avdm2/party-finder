import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProfileMe, getProfileByUsername, sendRating, sendConfirmationRequest, confirmProfile } from "../../../api/ApiClientProfile";
import "../../../styles/UserProfile.css";
import createDefaultProfile from '../../../utils/base64Util';
import { Button, Avatar, IconButton, TextField, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { PhotoCamera } from "@mui/icons-material";
import { createChat } from "../../../api/ApiClientChat";

let defaultProfileCache = null;

const UserProfile = () => {
    const [role, setRole] = useState(null);
    const { username } = useParams();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [rating, setRating] = useState(1);
    const [comment, setComment] = useState("");
    const [receiveEntityId, setReceiveEntityId] = useState(null);
    const [avatarFile, setAvatarFile] = useState(null);
    const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
    const [confirmationCode, setConfirmationCode] = useState("");
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editFormData, setEditFormData] = useState({
        name: "",
        surname: "",
        phone: "",
        aboutMe: "",
        birthDate: ""
    });
    const navigate = useNavigate();
    useEffect(() => {
        const token = localStorage.getItem("token");
        const payload = JSON.parse(atob(token.split(".")[1]));
        setRole(payload.roles)
        const fetchProfile = async () => {
            try {
                let data;
                if (username === "me") {
                    data = await getProfileMe();
                    console.log(data);
                    setEditFormData({
                        name: data.name || "",
                        surname: data.surname || "",
                        phone: data.phone || "",
                        aboutMe: data.aboutMe || "",
                        birthDate: data.birthDate ? data.birthDate.split('T')[0] : ""
                    });
                } else {
                    data = await getProfileByUsername(username);
                    setReceiveEntityId(data.id);
                }
                setProfile(data);
                setError(null);
            } catch (err) {
                console.error("Ошибка при загрузке профиля:", err);
                setError("Профиль не найден");
                setProfile(defaultProfileCache || (await createDefaultProfile()));
            } finally {
                setLoading(false);
            }
        };
        if (!defaultProfileCache) {
            createDefaultProfile().then(profile => {
                defaultProfileCache = profile;
            });
        }
        if (username) {
            fetchProfile();
        }
    }, [username]);

    const handleEditProfile = () => {
        setIsEditModalOpen(true);
    };

    const handleEditFormChange = (e) => {
        const { name, value } = e.target;
        setEditFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmitEdit = async () => {
        try {
            const token = localStorage.getItem("token");
            const payload = JSON.parse(atob(token.split(".")[1]));
            const ownerUsername = payload.sub;
            const response = await fetch("http://localhost:8724/api/v1/client-service/profile/update", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(editFormData)
            });

            if (!response.ok) {
                throw new Error("Ошибка при обновлении профиля");
            }


            const updatedProfile = await getProfileMe();
            setProfile(updatedProfile);
            setIsEditModalOpen(false);
            alert("Профиль успешно обновлен!");
        } catch (error) {
            console.error("Ошибка при обновлении профиля:", error);
            alert("Произошла ошибка при обновлении профиля");
        }
    };

    if (loading) {
        return <div className="profile-loading">Загрузка профиля...</div>;
    }
    if (error) {
        return (
            <div className="profile-error">
                <h2>{error}</h2>
                <button className="back-button" onClick={() => navigate(-1)}>
                    Назад
                </button>
            </div>
        );
    }

    const handleRateClick = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setRating(1);
        setComment("");
    };

    const handleRatingChange = (event) => {
        setRating(Number(event.target.value));
    };

    const handleCommentChange = (event) => {
        setComment(event.target.value);
    };

    const handleSubmitRating = async () => {
        try {
            const token = localStorage.getItem("token");
            await sendRating(receiveEntityId, rating, comment, token);
            alert("Оценка успешно отправлена!");
            handleCloseModal();
        } catch (error) {
            console.error("Ошибка при отправке оценки:", error);
            alert("Произошла ошибка при отправке оценки.");
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
        const token = localStorage.getItem("token");
        const formData = new FormData();
        formData.append("file", file);
        try {
            const response = await fetch(
                `http://localhost:8724/api/v3/media/user/uploadPhoto?username=${profile.username}`,
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
            const updatedProfile = await getProfileByUsername(profile.username);
            if (updatedProfile.media) {
                setProfile((prevProfile) => ({ ...prevProfile, media: updatedProfile.media }));
            }
        } catch (error) {
            console.error("Ошибка при загрузке фото:", error);
            alert("Ошибка при загрузке фото: " + error.message);
        }
    };

    const handleConfirmClick = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await sendConfirmationRequest(token);
            if (response.ok) {
                alert("Запрос на подтверждение отправлен. Пожалуйста, введите код подтверждения.");
                setIsConfirmationModalOpen(true);
            } else {
                const errorText = await response.text();
                console.error("Ошибка при отправке запроса на подтверждение:", errorText);
                alert(`Ошибка при отправке запроса на подтверждение: ${errorText}`);
            }
        } catch (error) {
            console.error("Ошибка при отправке запроса на подтверждение:", error);
            alert("Произошла ошибка при отправке запроса на подтверждение.");
        }
    };

    const handleCloseConfirmationModal = () => {
        setIsConfirmationModalOpen(false);
        setConfirmationCode("");
    };

    const handleConfirmationCodeChange = (event) => {
        setConfirmationCode(event.target.value);
    };

    const handleSubmitConfirmationCode = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await confirmProfile(confirmationCode, token);
            console.log(response);
            if (typeof response === 'string' && response.includes("Профиль успешно подтвержден.")) {
                alert("Профиль успешно подтвержден!");
                const updatedProfile = await getProfileMe();
                setProfile(updatedProfile);
                handleCloseConfirmationModal();
            } else {
                const errorText = typeof response === 'string' ? response : "Неизвестная ошибка";
                console.error("Ошибка подтверждения профиля:", errorText);
                alert(`Ошибка подтверждения профиля: ${errorText}`);
            }
        } catch (error) {
            console.error("Ошибка при подтверждении профиля:", error.message);
            alert("Произошла ошибка при подтверждении профиля.");
        }
    };

    const handleSendMessageClick = async () => {
        try {
            const token = localStorage.getItem("token");
            const payload = JSON.parse(atob(token.split(".")[1]));
            const ownerUsername = payload.sub;
            const response = await createChat([ownerUsername, profile.username], token);
            const chatId = response.id;
            navigate(`/chat/${chatId}`);
        } catch (error) {
            console.error("Ошибка при создании чата:", error);
            alert("Произошла ошибка при создании чата.");
        }
    };

    return (
        <div className="user-profile-container">
            <div className="profile-header">
                <div className="profile-avatar">
                    {profile?.media?.fileData ? (
                        <Avatar
                            src={`data:image/jpeg;base64,${profile.media.fileData}`}
                            sx={{ width: 120, height: 120, margin: "auto", bgcolor: "grey.300" }}
                        />
                    ) : (
                        <Avatar
                            sx={{ width: 120, height: 120, margin: "auto", bgcolor: "grey.300" }}
                        >
                            <PhotoCamera fontSize="large" />
                        </Avatar>
                    )}
                    {username === "me" && (
                        <IconButton component="label">
                            <input hidden accept="image/*" type="file" onChange={handleAvatarChange} />
                            <PhotoCamera />
                        </IconButton>
                    )}
                </div>
                <div className="profile-info">
                    <h1>
                        {profile.name} {profile.surname || ""}
                    </h1>
                    <p className="username">@{profile.username}</p>
                    <p className="email">{profile.email}</p>
                </div>
            </div>
            <div className="profile-content">
                <div className="profile-stats">
                    <div className="stat-item">
                        <strong>Телефон:</strong>{" "}
                        {profile.phone || "Не указан"}
                    </div>
                    <div className="stat-item">
                        <strong>Подтвержден:</strong>{" "}
                        {profile.isConfirmed ? "Да" : "Нет"}
                    </div>
                </div>
                <div className="profile-details">
                    <div className="detail-item">
                        <strong>Дата рождения:</strong>{" "}
                        {profile.birthDate
                            ? new Date(profile.birthDate).toLocaleDateString()
                            : "Не указано"}
                    </div>
                    <div className="detail-item">
                        <strong>Аккаунт создан:</strong>{" "}
                        {profile.createdTime
                            ? new Date(profile.createdTime).toLocaleString()
                            : "Неизвестно"}
                    </div>
                    <div className="rating-item">
                        <strong>Рейтинг:</strong>{" "}
                        {profile.rating ?? "Неизвестно"}
                    </div>
                    <div className="detail-item">
                        <strong>Последнее обновление:</strong>{" "}
                        {profile.updatedTime
                            ? new Date(profile.updatedTime).toLocaleString()
                            : "Неизвестно"}
                    </div>
                    <div className="detail-item">
                        <strong>О себе:</strong>{" "}
                        {profile.aboutMe || "Не указано"}
                    </div>
                </div>
                {username === "me" && (
                <div className="profile-actions">
                    <button className="edit-profile-button" onClick={handleEditProfile}>
                        Изменить профиль
                    </button>
                    {!profile.isConfirmed && (
                        <button className="confirm-profile-button" onClick={handleConfirmClick}>
                            Подтвердить профиль
                        </button>
                    )}
                </div>
                )}
                {username !== "me" && (
                    <>
                        <Button variant="contained" color="primary" onClick={handleRateClick}>
                            Оценить
                        </Button>
                    </>
                )}
                {username !== "me" && role === "PARTICIPANT" && (
                    <>
                        <Button variant="contained" color="secondary" onClick={handleSendMessageClick}>
                            Отправить сообщение
                        </Button>
                    </>
                )}
            </div>

            {/* Модальное окно редактирования профиля */}
            <Dialog
                open={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                className="edit-profile-modal"
            >
                <DialogTitle>Редактирование профиля</DialogTitle>
                <DialogContent>
                    <TextField
                        margin="dense"
                        name="name"
                        label="Имя"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={editFormData.name}
                        onChange={handleEditFormChange}
                    />
                    <TextField
                        margin="dense"
                        name="surname"
                        label="Фамилия"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={editFormData.surname}
                        onChange={handleEditFormChange}
                    />
                    <TextField
                        margin="dense"
                        name="phone"
                        label="Телефон"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={editFormData.phone}
                        onChange={handleEditFormChange}
                    />
                    <TextField
                        margin="dense"
                        name="birthDate"
                        label="Дата рождения"
                        type="date"
                        fullWidth
                        variant="outlined"
                        InputLabelProps={{ shrink: true }}
                        value={editFormData.birthDate}
                        onChange={handleEditFormChange}
                    />
                    <TextField
                        margin="dense"
                        name="aboutMe"
                        label="О себе"
                        type="text"
                        fullWidth
                        variant="outlined"
                        multiline
                        rows={4}
                        value={editFormData.aboutMe}
                        onChange={handleEditFormChange}
                    />
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => setIsEditModalOpen(false)}
                        variant="outlined"
                        color="primary"
                    >
                        Отмена
                    </Button>
                    <Button
                        onClick={handleSubmitEdit}
                        variant="contained"
                        color="primary"
                    >
                        Сохранить
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Остальные модальные окна остаются без изменений */}
            {isModalOpen && (
                <div className="modal-overlay" onClick={handleCloseModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h2>Оцените профиль</h2>
                        <div className="rating-selector">
                            {[1, 2, 3, 4, 5].map((num) => (
                                <label key={num} className={`rating-label ${rating === num ? 'selected' : ''}`}>
                                    <input
                                        type="radio"
                                        value={num}
                                        checked={rating === num}
                                        onChange={handleRatingChange}
                                    />
                                    {num}
                                </label>
                            ))}
                        </div>
                        <textarea
                            className="comment-input"
                            placeholder="Введите ваш комментарий"
                            value={comment}
                            onChange={handleCommentChange}
                        />
                        <div className="modal-buttons">
                            <button className="submit-button" onClick={handleSubmitRating}>
                                Отправить
                            </button>
                            <button className="cancel-button" onClick={handleCloseModal}>
                                Закрыть
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {isConfirmationModalOpen && (
                <Dialog open={isConfirmationModalOpen} onClose={handleCloseConfirmationModal}>
                    <DialogTitle>Подтверждение профиля</DialogTitle>
                    <DialogContent>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="confirmation-code"
                            label="Код подтверждения"
                            type="text"
                            fullWidth
                            value={confirmationCode}
                            onChange={handleConfirmationCodeChange}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseConfirmationModal} color="primary">
                            Закрыть
                        </Button>
                        <Button onClick={handleSubmitConfirmationCode} color="primary">
                            Подтвердить
                        </Button>
                    </DialogActions>
                </Dialog>
            )}
        </div>
    );
};

export default UserProfile;