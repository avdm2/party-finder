import axios from "axios";

const API_URL = "http://localhost:8724/api/v1/client-service/profile";

export const createProfile = async (clientDTO) => {
    try {
        const response = await axios.post(`${API_URL}/create`, clientDTO);
        return response.data;
    } catch (error) {
        console.error("Ошибка при создании профиля:", error.response?.data || error.message);
        throw error;
    }
};

export const getProfile = async (username) => {
    const response = await axios.get(`/api/profile/${username}`);
    const data = response.data;

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