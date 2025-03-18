export async function createOrganizerProfile(profileData) {
    const token = localStorage.getItem("token");
    const response = await fetch("http://localhost:8722/api/v1/organizer", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(profileData)
    });
    return response.ok;
}