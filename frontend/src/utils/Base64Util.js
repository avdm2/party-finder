import avatar from '../defualtPhoto.jpg';

function getBase64FromImageUrl(imageUrl) {
    return new Promise((resolve, reject) => {
        fetch(imageUrl)
            .then(response => response.arrayBuffer())
            .then(buffer => {
                const base64 = arrayBufferToBase64(buffer);
                resolve(base64);
            })
            .catch(error => reject(error));
    });
}

function arrayBufferToBase64(arrayBuffer) {
    let bytes = new Uint8Array(arrayBuffer);
    let byteString = '';
    for (let i = 0; i < bytes.length; i++) {
        byteString += String.fromCharCode(bytes[i]);
    }
    return btoa(byteString);
}
async function createDefaultProfile() {
    try {
        const base64String = await getBase64FromImageUrl(avatar);
        const defaultProfile = {
            username: "guest_user",
            name: "Гость",
            surname: "Неизвестный",
            email: "guest@example.com",
            birthDate: null,
            rating: 0,
            isConfirmed: false,
            media: {
                fileUrl: `data:image/jpeg;base64,${base64String}`
            },
            createdTime: null,
            updatedTime: null,
        };

        console.log("Default Profile:", defaultProfile);
        return defaultProfile;
    } catch (error) {
        console.error("Ошибка при создании defaultProfile:", error);
        return null;
    }
}

export default createDefaultProfile;