
const API_URL = "http://localhost:8727/api/v3/chat";

export const getChats = async () => {
    const token = localStorage.getItem("token");

    const response = await fetch(`${API_URL}/user`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    });
    console.log(response.json())
    return response;
};

export const createChat = async (data, token) => {
    const response = await fetch(`${API_URL}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: {}
    });
    console.log(response.json())
    return response;
};