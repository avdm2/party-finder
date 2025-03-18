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
    try {
        const response = await axios.get(`${API_URL}/${username}`);
        return response.data; 
    } catch (error) {
        console.error("Ошибка при получении профиля:", error.response?.data || error.message);
        throw error;
    }
};