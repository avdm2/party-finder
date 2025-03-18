import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getProfile } from "../utils/api";
import "../styles/UserProfile.css";

const UserProfile = () => {
    const { username } = useParams();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const data = await getProfile(username);
                setProfile(data);
                setError(null);
            } catch (err) {
                setError("Не удалось загрузить профиль.");
            } finally {
                setLoading(false);
            }
        };

        if (username) {
            fetchProfile();
        }
    }, [username]);

    if (loading) {
        return <div>Загрузка профиля...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="user-profile-container">
            <h2>Профиль пользователя</h2>
            {profile && (
                <div>
                    <div className="profile-info">
                        <div>
                            <strong>Username:</strong> {profile.username}
                        </div>
                        <div>
                            <strong>Имя:</strong> {profile.name} {profile.surname}
                        </div>
                        <div>
                            <strong>Email:</strong> {profile.email}
                        </div>
                        <div>
                            <strong>Дата рождения:</strong>{" "}
                            {profile.birthDate ? new Date(profile.birthDate).toLocaleDateString() : "Не указано"}
                        </div>
                        <div>
                            <strong>Рейтинг:</strong>{" "}
                            {profile.rating !== null ? profile.rating.toFixed(2) : "Нет рейтинга"}
                        </div>
                        <div>
                            <strong>Подтвержден:</strong>{" "}
                            {profile.isConfirmed ? "Да" : "Нет"}
                        </div>
                        <div>
                            <strong>Фото:</strong>{" "}
                            {profile.media?.fileUrl ? (
                                <img
                                    src={profile.media.fileUrl}
                                    alt={`${profile.username}'s photo`}
                                    className="profile-photo"
                                />
                            ) : (
                                <span>Фото не установлено</span>
                            )}
                        </div>
                        <div>
                            <strong>Создан:</strong>{" "}
                            {profile.createdTime
                                ? new Date(profile.createdTime).toLocaleString()
                                : "Неизвестно"}
                        </div>
                        <div>
                            <strong>Обновлен:</strong>{" "}
                            {profile.updatedTime
                                ? new Date(profile.updatedTime).toLocaleString()
                                : "Неизвестно"}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserProfile;