const API_URL = "http://localhost:8723/api/events/filter";

export const fetchEventsRequest = async (filters, pagination) => {
    const params = new URLSearchParams({ ...filters, ...pagination });
    const url = `${API_URL}/?${params.toString()}`;
    const token = localStorage.getItem("token");

    try {
        const response = await fetch(url, {
            method: "GET",
                headers: {
                "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
            },
        });
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Ошибка при загрузке мероприятий:", error);
        throw error;
    }
};