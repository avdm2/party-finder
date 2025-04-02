import React, { useState } from "react";
import { useProfileService } from "../../services/participant/ProfileService";
import "../../styles/MainStyle.css";

const CreateProfile = () => {
    const [phone, setPhone] = useState("");
    const [birthDate, setBirthDate] = useState("");
    const [aboutMe, setAboutMe] = useState("");

    const { handleCreateProfile } = useProfileService();

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!birthDate || !phone) {
            alert("Заполните все обязательные поля!");
            return;
        }

        const clientDTO = {
            phone,
            birthDate,
            aboutMe,
        };

        try {
            await handleCreateProfile(clientDTO);
            alert("Профиль успешно создан!");
        } catch (error) {
            console.error("Ошибка:", error);
        }
    };

    return (
        <div className="create-profile-container">
            <h2>Создание профиля</h2>
            <form onSubmit={handleSubmit} className="create-profile-form">
                <div className="form-group">
                    <label>Телефон:</label>
                    <input
                        type="tel"
                        name="phone"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="Введите номер телефона"
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Дата рождения:</label>
                    <input
                        type="date"
                        name="birthDate"
                        value={birthDate}
                        onChange={(e) => setBirthDate(e.target.value)}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>О себе:</label>
                    <textarea
                        name="aboutMe"
                        value={aboutMe}
                        onChange={(e) => setAboutMe(e.target.value)}
                        placeholder="Расскажите немного о себе"
                    />
                </div>

                <button type="submit" className="create-profile-button">
                    Создать профиль
                </button>
            </form>
        </div>
    );
};

export default CreateProfile;