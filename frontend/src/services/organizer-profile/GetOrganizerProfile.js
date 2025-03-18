export async function getOrganizerProfile(username) {
    const token = localStorage.getItem("token");
    console.log("TOKENTOKEN::::: " + token);
    if (!token) {
        console.error("Токен отсутствует в localStorage");
        return null;
    }

    const response = await fetch(`http://localhost:8722/api/v1/organizer/username/${username}`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    });

    if (!response.ok) {
        console.error(`Ошибка получения профиля: ${response.status}`);
        return null;
    }

    return await response.json();
}
