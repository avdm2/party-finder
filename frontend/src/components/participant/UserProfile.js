import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProfileMe, getProfileByUsername, sendRating } from "../../utils/ApiClientProfile";
import "../../styles/UserProfile.css";
import createDefaultProfile from '../../utils/Base64Util';
import { Button, Avatar, IconButton } from "@mui/material";
import { PhotoCamera } from "@mui/icons-material";

let defaultProfileCache = null;

const UserProfile = () => {
    const { username } = useParams();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [rating, setRating] = useState(1);
    const [comment, setComment] = useState("");
    const [receiveEntityId, setReceiveEntityId] = useState(null);
    const [avatarFile, setAvatarFile] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                let data;
                if (username === "me") {
                    data = await getProfileMe();
                    console.log(data);
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
                {username !== "me" && (
                    <button className="rate-button" onClick={handleRateClick}>
                        Оценить
                    </button>
                )}
            </div>
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
        </div>
    );
};

export default UserProfile;