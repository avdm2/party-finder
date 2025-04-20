import { jwtDecode } from "jwt-decode";


const API_URL = "http://localhost:8724/api/v1/client-service/profile";

const API_URL_EMAIL = "http://localhost:8724/api/v1/client-service/email";


const API_RATING_URL = "http://localhost:8725/api/v1/ratingSystem"




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

export const getProfileByUsernamePaginationClients = async (username, page, size, token) => {
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

export const sendRating = async (receiveEntityId, score, comment, token) => {
    try {
        const decodedToken = jwtDecode(token);
        const senderEntityType = decodedToken.roles[0];

        const requestDTO = {
            receiveEntityId,
            receiveEntityType: "PARTICIPANT",
            senderEntityType,
            score: Number(score),
            comment
        };
        console.log(requestDTO)

        const response = await fetch(`${API_RATING_URL}/putRating`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(requestDTO)
        });

        if (!response.ok) {
            throw new Error(`Ошибка сервера: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Ошибка при отправке оценки:", error.response?.data || error.message);
        throw error;
    }
};

export const sendConfirmationRequest = async (token) => {
    try {
        console.log(token);
        const response = await fetch(`${API_URL_EMAIL}/send-confirmation-request-user`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: {}
        });
        console.log(response)
        return response;
    } catch (error) {
        console.error("Ошибка при создании профиля:", error.response?.data || error.message);
        throw error;
    }
};

export const confirmProfile = async (code, token) => {
    const requestDTO = {
        code
    };
    console.log(requestDTO);
    try {
        console.log(token);
        const response = await fetch(`${API_URL_EMAIL}/confirm`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(requestDTO)
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorText}`);
        }

        console.log(response);
        const data = await response.text(); // Парсим тело ответа как текст
        return data;
    } catch (error) {
        console.error("Ошибка при подтверждении профиля:", error.message);
        throw error;
    }
};
