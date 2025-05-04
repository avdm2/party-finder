import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/MainStyle.css";
import { registerUser } from "./Auth";

function Register() {
    const [formData, setFormData] = useState({
        firstname: "", lastname: "", username: "", password: "", email: "", role: "PARTICIPANT"
    });
    const [errors, setErrors] = useState({
        email: "",
        general: ""
    });
    const navigate = useNavigate();

    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        if (name === "email") {
            if (value && !validateEmail(value)) {
                setErrors({...errors, email: "Некорректный формат email"});
            } else {
                setErrors({...errors, email: ""});
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({...errors, general: ""});

        if (!validateEmail(formData.email)) {
            setErrors({...errors, email: "Некорректный формат email"});
            return;
        }

        const result = await registerUser(formData);
        if (result.success) {
            navigate("/login");
        } else {
            setErrors({...errors, general: result.message || "Произошла ошибка при регистрации"});
        }
    };

    return (
        <div className="create-profile-container">
            <h2>Регистрация</h2>
            <form className="create-profile-form" onSubmit={handleSubmit}>
                {Object.keys(formData).map((key) => (
                    key !== "role" && (
                        <div className="form-group" key={key}>
                            <label>{key.charAt(0).toUpperCase() + key.slice(1)}</label>
                            <input
                                name={key}
                                type={key === "password" ? "password" : "text"}
                                value={formData[key]}
                                onChange={handleChange}
                                required
                            />
                            {key === "email" && errors.email && (
                                <div style={{color: "red", fontSize: "0.8rem", marginTop: "0.3rem"}}>
                                    {errors.email}
                                </div>
                            )}
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
                <button
                    className="create-profile-button"
                    type="submit"
                    disabled={!!errors.email}
                >
                    Зарегистрироваться
                </button>

                {errors.general && (
                    <div style={{
                        color: "red",
                        marginTop: "10px",
                        textAlign: "center",
                        fontSize: "0.9rem"
                    }}>
                        {errors.general}
                    </div>
                )}
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