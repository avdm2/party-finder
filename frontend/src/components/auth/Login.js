import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/MainStyle.css";
import { loginUser } from "../../services/auth/Auth";
import { getProfileByUsername } from "../../utils/ApiClientProfile";
import { useAuth } from "../../services/auth/AuthContext";

function Login() {
    const [formData, setFormData] = useState({ username: "", password: "" });
    const [error, setError] = useState(""); // Храним сообщение об ошибке
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError(""); // Сбрасываем ошибку при вводе
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await loginUser(formData);

        if (!result.success) {
            setError(result.message);
            return;
        }

        login(result.token);
        const payload = JSON.parse(atob(result.token.split(".")[1]));

        if (payload.roles.includes("ORGANIZER")) {
            navigate("/organizer-profile");
        } else if (payload.roles.includes("PARTICIPANT")) {
            try {
                const profile = await getProfileByUsername(payload.sub);
                navigate("/profile/me");
            } catch (error) {
                navigate("/create-profile");
            }
        } else {
            navigate("/homepage");
        }
    };

    return (
        <div className="create-profile-container">
            <h2>Вход</h2>
            <form className="create-profile-form" onSubmit={handleSubmit}>
                {error && <div className="error-message">{error}</div>} {/* Вывод ошибки */}
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
