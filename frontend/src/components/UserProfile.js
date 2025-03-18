import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProfile } from "../utils/api";
import "../styles/UserProfile.css";
import createDefaultProfile from '../utils/Base64Util'; // Импортируем функцию

let defaultProfileCache = null; // Кэш для defaultProfile

const UserProfile = () => {
    const { username } = useParams();
    const [profile, setProfile] = useState(null); // Используем null вместо defaultProfile
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate(); // Хук для навигации

    useEffect(() => {
        // Если кэш еще не создан, создаем defaultProfile
        if (!defaultProfileCache) {
            createDefaultProfile().then(profile => {
                defaultProfileCache = profile; // Сохраняем в кэше
                if (!username) {
                    setProfile(defaultProfileCache); // Если нет username, используем defaultProfile
                    setLoading(false);
                }
            });
        }

        const fetchProfile = async () => {
            try {
                const data = await getProfile(username);
                setProfile(data); // Устанавливаем полученные данные
            } catch (err) {
                console.error("Ошибка при загрузке профиля:", err);
                // Если произошла ошибка, используем defaultProfile из кэша
                setProfile(defaultProfileCache || (await createDefaultProfile()));
            } finally {
                setLoading(false);
            }
        };

        if (username) {
            fetchProfile();
        }
    }, [username]);

    if (loading) {
        return <div className="profile-loading">Загрузка профиля...</div>;
    }

    const handleFindEvent = () => {
        navigate("/find-event"); // Переход на страницу поиска мероприятий
    };

    return (
        <div className="user-profile-container">
            <div className="profile-header">
                <div className="profile-avatar">
                    {profile?.media?.fileUrl ? (
                        <img
                            src={profile.media.fileUrl}
                            alt={`${profile.username}'s photo`}
                            className="avatar-image"
                        />
                    ) : (
                        <div className="default-avatar">?</div>
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
                        <strong>Рейтинг:</strong>{" "}
                        {profile.rating !== null
                            ? profile.rating.toFixed(2)
                            : "Нет рейтинга"}
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
                    <div className="detail-item">
                        <strong>Последнее обновление:</strong>{" "}
                        {profile.updatedTime
                            ? new Date(profile.updatedTime).toLocaleString()
                            : "Неизвестно"}
                    </div>
                </div>
                <button onClick={handleFindEvent} className="find-event-button">
                    Найти мероприятие
                </button>
            </div>
        </div>
    );
};

export default UserProfile;