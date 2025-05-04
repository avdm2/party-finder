import { jwtDecode } from "jwt-decode";


const API_RATING_URL = "http://localhost:8725/api/v1/ratingSystem"
const API_URL = "http://localhost:8722/api/v1/organizer";




export const sendRating = async (receiveEntityId, score, comment, token) => {
    try {
        const decodedToken = jwtDecode(token);
        const senderEntityType = decodedToken.roles[0];

        const requestDTO = {
            receiveEntityId,
            receiveEntityType: "ORGANIZER",
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

export const getProfileByUsernameOrganizer = async (username) => {
    const token = localStorage.getItem("token");
    console.log(token);
    const response = await fetch(`${API_URL}/username/${username}`, {
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

export const getProfileByUsernamePaginationOrganizers = async (username, page, size, token) => {
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
        return {page:{totalPages:0}}
    }
};

export async function getOrganizerProfile(username) {
    const token = localStorage.getItem("token");
    if (!token) {
        console.error("Токен отсутствует в localStorage");
        return null;
    }

    const response = await fetch(`http://localhost:8722/api/v1/organizer/username/${username}`, {
        method: "GET",
        headers: {Authorization: `Bearer ${token}`, "Content-Type": "application/json"},
    });

    if (!response.ok) {
        console.error(`Ошибка получения профиля: ${response.status}`);
        return null;
    }

    return await response.json();
}


export async function getOrganizerProfileById(id) {
    const token = localStorage.getItem("token");
    if (!token) {
        console.error("Токен отсутствует в localStorage");
        return null;
    }

    const response = await fetch(`http://localhost:8722/api/v1/organizer/id/${id}`, {
        method: "GET",
        headers: {Authorization: `Bearer ${token}`, "Content-Type": "application/json"},
    });

    if (!response.ok) {
        console.error(`Ошибка получения профиля: ${response.status}`);
        return null;
    }

    return await response.json();
}
