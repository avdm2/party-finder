const API_URL = "http://localhost:8724/api/v1/client-service/profile";

export const createProfile = async (clientDTO, token) => {
    try {
        console.log(token);
        const response = await fetch(`${API_URL}/create`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(clientDTO)
        });
        return response.data;
    } catch (error) {
        console.error("Ошибка при создании профиля:", error.response?.data || error.message);
        throw error;
    }
};

export const getProfileMe = async () => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/me`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error(`Ошибка сервера: ${response.status}`);
    }

    return await response.json();
};

export const getProfileByUsername = async (username) => {
    const token = localStorage.getItem("token");
    console.log(token);
    const response = await fetch(`${API_URL}/by-username/${username}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error(`Ошибка сервера: ${response.status}`);
    }

    const data = await response.json();

    if (data.media && data.media.fileData) {
        const base64String = btoa(
            new Uint8Array(data.media.fileData).reduce(
                (acc, byte) => acc + String.fromCharCode(byte),
                ""
            )
        );
        data.media.fileUrl = `data:${data.media.mimeType};base64,${base64String}`;
    }

    return data;
};

export const getProfileByUsernamePagination = async (username, page, size, token) => {
    try {
        const response = await fetch(`${API_URL}/search?username=${username}&page=${page}&size=${size}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error(`Ошибка сервера: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Ошибка при получении профиля по username:", error.response?.data || error.message);
        throw error;
    }
};