import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "./AuthService";
import "../../styles/MainStyle.css";

function Login() {
    const [formData, setFormData] = useState({ username: "", password: "" });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = await loginUser(formData);
        if (!token) {
            console.error("Ошибка аутентификации");
            return;
        }

        localStorage.setItem("token", token);
        const payload = JSON.parse(atob(token.split(".")[1]));

        if (payload.roles.includes("ORGANIZER")) {
            navigate("/organizer-profile");
        } else {
            navigate("/homepage");
        }
    };

    return (
        <div className="create-profile-container">
            <h2>Вход</h2>
            <form className="create-profile-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Логин</label>
                    <input name="username" type="text" value={formData.username} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>Пароль</label>
                    <input name="password" type="password" value={formData.password} onChange={handleChange} required />
                </div>
                <button className="create-profile-button" type="submit">Войти</button>
            </form>
            <div style={{ marginTop: "10px" }}>
                <button className="create-profile-button" onClick={() => navigate("/register")}>
                    Зарегистрироваться
                </button>
            </div>
        </div>
    );
}
export default Login;