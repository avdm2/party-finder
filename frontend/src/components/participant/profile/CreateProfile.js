import React, { useState } from "react";
import { useProfileService } from "./ProfileService";
import "../../../styles/MainStyle.css";

const CreateProfile = () => {
    const [phone, setPhone] = useState("");
    const [birthDate, setBirthDate] = useState("");
    const [aboutMe, setAboutMe] = useState("");
    const [phoneError, setPhoneError] = useState("");
    const [birthDateError, setBirthDateError] = useState("");

    const { handleCreateProfile } = useProfileService();

    const validatePhone = (phoneNumber) => {
        const regex = /^\+7\d{10}$/;
        return regex.test(phoneNumber);
    };

    const validateBirthDate = (date) => {
        if (!date) return false;

        const today = new Date();
        const birthDate = new Date(date);
        const age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();

        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            return age - 1 >= 14;
        }
        return age >= 14;
    };

    const handlePhoneChange = (e) => {
        const value = e.target.value;
        setPhone(value);

        if (value && !validatePhone(value)) {
            setPhoneError("Номер должен быть в формате +7XXXXXXXXXX");
        } else {
            setPhoneError("");
        }
    };

    const handleBirthDateChange = (e) => {
        const value = e.target.value;
        setBirthDate(value);

        if (value && !validateBirthDate(value)) {
            setBirthDateError("Вам должно быть больше 14 лет");
        } else {
            setBirthDateError("");
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!phone) {
            setPhoneError("Введите номер телефона");
            return;
        } else if (!validatePhone(phone)) {
            setPhoneError("Номер должен быть в формате +7XXXXXXXXXX");
            return;
        }

        if (!birthDate) {
            setBirthDateError("Введите дату рождения");
            return;
        } else if (!validateBirthDate(birthDate)) {
            setBirthDateError("Вам должно быть больше 14 лет");
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
                        onChange={handlePhoneChange}
                        placeholder="+7XXXXXXXXXX"
                        required
                    />
                    {phoneError && <div className="error-message" style={{color: "red", fontSize: "0.8rem", marginTop: "0.5rem"}}>{phoneError}</div>}
                </div>

                <div className="form-group">
                    <label>Дата рождения:</label>
                    <input
                        type="date"
                        name="birthDate"
                        value={birthDate}
                        onChange={handleBirthDateChange}
                        required
                    />
                    {birthDateError && <div className="error-message" style={{color: "red", fontSize: "0.8rem", marginTop: "0.5rem"}}>{birthDateError}</div>}
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