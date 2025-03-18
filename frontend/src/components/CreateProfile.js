import React, { useState } from "react";
import { useProfileService } from "../services/ProfileService";
import "../styles/CreateProfile.css"; // Импортируем стили

const CreateProfile = () => {
    const [name, setName] = useState("");
    const [surname, setSurname] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [birthDate, setBirthDate] = useState("");

    const { handleCreateProfile } = useProfileService();

    // Обработка отправки формы
    const handleSubmit = async (event) => {
        event.preventDefault(); // Отменяем стандартное действие формы

        if (!name || !surname || !username || !email || !birthDate) {
            alert("Заполните все поля!");
            console.log("ХУЙ");
            return;
        }

        const clientDTO = {
            name,
            surname,
            username,
            email,
            birthDate: new Date(birthDate),
        };

        try {
            await handleCreateProfile(clientDTO);
        } catch (error) {
            console.error("Ошибка:", error);
        }
    };

    return (
        <div className="create-profile-container">
            <h2>Создание профиля</h2>
            <form onSubmit={handleSubmit} className="create-profile-form">
                <div className="form-group">
                    <label>Имя:</label>
                    <input
                        type="text"
                        name="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Введите имя"
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Фамилия:</label>
                    <input
                        type="text"
                        name="surname"
                        value={surname}
                        onChange={(e) => setSurname(e.target.value)}
                        placeholder="Введите фамилию"
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Username:</label>
                    <input
                        type="text"
                        name="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Введите username"
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Email:</label>
                    <input
                        type="email"
                        name="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Введите email"
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

                <button type="submit" className="create-profile-button">
                    Создать профиль
                </button>
            </form>
        </div>
    );
};

export default CreateProfile;