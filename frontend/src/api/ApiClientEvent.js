import {getOrganizerProfileById} from "./ApiOrganizerProfile"

const API_BASE_URL_EVENT = "http://localhost:8723/api/v1/event";
const API_BASE_URL_CLIENT = "http://localhost:8724/api";

export const getEventById = async (eventId) => {
    const token = localStorage.getItem("token");
    try {
        const response = await fetch(`${API_BASE_URL_EVENT}/id/${eventId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || "Ошибка при получении события");
        }

        const eventData = await response.json();

        const statusMap = {
            "COMPLETED": "Завершено",
            "CANCELLED": "Отменено",
            "ONGOING": "Идет сейчас",
            "UPCOMING": "Предстоящее"
        };

        const organizerData = await getOrganizerProfileById(eventData.organizerId)

        return {
            ...eventData,
            organizerUsername: organizerData.username,
            dateOfEvent: new Date(eventData.dateOfEvent),
            createdTime: eventData.createdTime ? new Date(eventData.createdTime) : null,
            updatedTime: eventData.updatedTime ? new Date(eventData.updatedTime) : null,
            statusText: statusMap[eventData.status] || eventData.status,
            statusColor: getStatusColor(eventData.status)
        };
    } catch (error) {
        console.error("Ошибка в getEventById:", error);
        throw error;
    }
};

export const subscribeToEvent = async (eventId, token) => {
    try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        const username = payload.sub;

        const subscribeData = {
            eventId: eventId,
            username: username
        };

        const response = await fetch(`${API_BASE_URL_CLIENT}/clients/eventSubscribe/create`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(subscribeData)
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || "Ошибка при подписке на событие");
        }

        return await response.json();
    } catch (error) {
        console.error("Ошибка в subscribeToEvent:", error);
        throw error;
    }
};

export const cancelSubscription = async (eventId, username, token) => {
    try {
        const response = await fetch(`${API_BASE_URL_CLIENT}/clients/eventSubscribe/cancelEvent?username=${username}&eventId=${eventId}`, {
            method: "PATCH",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || "Ошибка при отмене подписки");
        }

        return true;
    } catch (error) {
        console.error("Ошибка в cancelSubscription:", error);
        throw error;
    }
};

const getStatusColor = (status) => {
    switch (status) {
        case "COMPLETED":
            return "default";
        case "CANCELLED":
            return "error";
        case "ONGOING":
            return "warning";
        case "UPCOMING":
            return "success";
        default:
            return "default";
    }
};

export const checkEventSubscription = async (eventId, token) => {
    try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        const username = payload.sub;

        const subscriptionData = {
            eventId: eventId,
            username: username
        };

        const response = await fetch(`${API_BASE_URL_CLIENT}/clients/eventSubscribe/isAttend`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(subscriptionData)
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || "Ошибка при проверке подписки");
        }

        return await response.json();
    } catch (error) {
        console.error("Ошибка в checkEventSubscription:", error);
        throw error;
    }
};

export const getMyEvents = async (token) => {
    try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        const username = payload.sub;

        const response = await fetch(`${API_BASE_URL_CLIENT}/clients/eventSubscribe/getAllEventsByUsername?username=${username}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || "Ошибка при получении списка мероприятий");
        }
        return await response.json();
    } catch (error) {
        console.error("Ошибка в getMyEvents:", error);
        throw error;
    }
};

export const getEventSubscribers = async (eventId, token) => {
    try {
        const response = await fetch(`${API_BASE_URL_CLIENT}/clients/eventSubscribe/getSubscribers?eventId=${eventId}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || "Ошибка при получении подписчиков");
        }

        return await response.json();
    } catch (error) {
        console.error("Ошибка в getEventSubscribers:", error);
        throw error;
    }
};