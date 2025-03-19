import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/MainStyle.css";

const API_BASE_URL = "http://localhost:8721/api/v1/auth";

export async function registerUser(formData) {
    const response = await fetch(`${API_BASE_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
    });
    return response.ok;
}

export async function loginUser(formData) {
    const response = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
    });

    if (response.ok) {
        const data = await response.json();
        localStorage.setItem("token", data.token);
        return data.token;
    } else {
        alert("Проверьте корректность данных")
    }
    return null;
}

function Auth({ isRegister }) {
    const navigate = useNavigate();
    const [formData, setFormData] = useState(
        isRegister ? {
            firstname: "", lastname: "", username: "", password: "", email: "", role: "PARTICIPANT"
        } : { username: "", password: "" }
    );

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isRegister) {
            if (await registerUser(formData)) navigate("/login");
        } else {
            const token = await loginUser(formData);
            if (!token) {
                console.error("Ошибка аутентификации");
                return;
            }
            const payload = JSON.parse(atob(token.split(".")[1]));
            navigate(payload.roles.includes("ORGANIZER") ? "/organizer-profile" : "/homepage");
        }
    };

    return (
        <div className="create-profile-container">
            <h2>{isRegister ? "Регистрация" : "Вход"}</h2>
            <form className="create-profile-form" onSubmit={handleSubmit}>
                {isRegister ? (
                    Object.keys(formData).map((key) => (
                        key !== "role" && (
                            <div className="form-group" key={key}>
                                <label>{key}</label>
                                <input name={key} type="text" value={formData[key]} onChange={handleChange} required />
                            </div>
                        )
                    ))
                ) : (
                    <>
                        <div className="form-group">
                            <label>Логин</label>
                            <input name="username" type="text" value={formData.username} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label>Пароль</label>
                            <input name="password" type="password" value={formData.password} onChange={handleChange} required />
                        </div>
                    </>
                )}
                {isRegister && (
                    <div className="form-group">
                        <label>Роль</label>
                        <select name="role" value={formData.role} onChange={handleChange} required>
                            <option value="ORGANIZER">ORGANIZER</option>
                            <option value="PARTICIPANT">PARTICIPANT</option>
                        </select>
                    </div>
                )}
                <button className="create-profile-button" type="submit">
                    {isRegister ? "Зарегистрироваться" : "Войти"}
                </button>
            </form>
            <div style={{ marginTop: "10px" }}>
                <button className="create-profile-button" onClick={() => navigate(isRegister ? "/login" : "/register")}>
                    {isRegister ? "Войти" : "Зарегистрироваться"}
                </button>
            </div>
        </div>
    );
}

export default Auth;