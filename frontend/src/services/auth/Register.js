// src/services/auth/Register.js
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/MainStyle.css";
import { registerUser } from "./Auth";

function Register() {
    const [formData, setFormData] = useState({
        firstname: "", lastname: "", username: "", password: "", email: "", role: "PARTICIPANT"
    });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (await registerUser(formData)) navigate("/login");
    };

    return (
        <div className="create-profile-container">
            <h2>Регистрация</h2>
            <form className="create-profile-form" onSubmit={handleSubmit}>
                {Object.keys(formData).map((key) => (
                    key !== "role" && (
                        <div className="form-group" key={key}>
                            <label>{key.charAt(0).toUpperCase() + key.slice(1)}</label>
                            <input name={key} type="text" value={formData[key]} onChange={handleChange} required />
                        </div>
                    )
                ))}
                <div className="form-group">
                    <label>Роль</label>
                    <select name="role" value={formData.role} onChange={handleChange} required>
                        <option value="ORGANIZER">ORGANIZER</option>
                        <option value="PARTICIPANT">PARTICIPANT</option>
                    </select>
                </div>
                <button className="create-profile-button" type="submit">Зарегистрироваться</button>
            </form>
            <div style={{ marginTop: "10px" }}>
                <button className="create-profile-button" onClick={() => navigate("/login")}>
                    Войти
                </button>
            </div>
        </div>
    );
}
export default Register;