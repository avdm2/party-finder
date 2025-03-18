export const API_BASE_URL = "http://localhost:8721/api/v1/auth";

export async function registerUser(formData) {
    const response = await fetch(`${API_BASE_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
    });
    return response.ok;
}

export async function loginUser(formData) {
    console.log("LOGIN FORM DATA = " + formData.username + ":::" + formData.password);
    const response = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
    });

    if (response.ok) {
        const data = await response.json();
        localStorage.setItem("token", data.token);
        return data.token; // Вернем сам токен, а не true
    }
    return null; // В случае ошибки вернем null
}
