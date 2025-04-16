export const API_BASE_URL = "http://localhost:8721/api/v1/auth";

export async function registerUser(formData) {
    const response = await fetch(`${API_BASE_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
    });

    if (response.ok) {
        return { success: true };
    }

    if (response.status === 400) {
        const errorData = await response.json();
        return { success: false, message: errorData.message || "Пользователь с таким именем уже зарегистрирован" };
    }

    return { success: false, message: "Ошибка регистрации. Попробуйте позже." };
}

export async function loginUser(formData) {

    console.log(formData)
    const response = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
    });

    if (response.ok) {
        const data = await response.json();
        localStorage.setItem("token", data.token);
        return { success: true, token: data.token };
    }

    if (response.status === 400) {
        const errorData = await response.json();
        return { success: false, message: errorData.message || "Неправильный логин или пароль" };
    }

    return { success: false, message: "Ошибка сервера. Попробуйте позже." };
}
