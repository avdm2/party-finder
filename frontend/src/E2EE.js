import {
    asymmetricKeyPair,
    decryptMessage,
    encryptMessage,
    importPublicKey,
    initializeEncryption
} from "./E2EEGenerateUtil";
import {displayMessage} from "./displayFunctions";

const socket = new WebSocket("ws://localhost:8725/ws");
const users = {};

socket.onopen = () => {
    console.log("WebSocket connected!");
};

export function sendToServer(data) {
    if (socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify(data));
        console.log("Sent to server:", data);
    } else {
        console.error("WebSocket is not open.");
    }
}



// Обработчик входящих сообщений через WebSocket
socket.onmessage = async (event) => {
    const data = JSON.parse(event.data);

    switch (data.type) {
        //если сообщение
        case "message":
            const { senderId, encryptedMessage } = data;
            console.log(`Получено сообщение от пользователя ${senderId}`);
            const decryptedMessage = await decryptMessage(encryptedMessage, asymmetricKeyPair.privateKey);
            console.log(`Расшифрованное сообщение: ${decryptedMessage}`);
            displayMessage(senderId, decryptedMessage);
            break;

            //получение чужого ключа
        case "public-key-response":
            const { userId, key } = data;
            const importedKey = await importPublicKey(key);
            users[userId] = { publicKey: importedKey };
            console.log(`Публичный ключ пользователя ${userId} сохранен`);
            break;
        case "error":
            console.error(`Ошибка от сервера: ${data.message}`);
            break;
        default:
            console.warn(`Неизвестный тип сообщения: ${data.type}`);
    }
};



export function requestPublicKey(userId) {
    sendToServer({ type: "request-public-key", userId });
}
export async function sendMessageToUser(recipientId, message) {
    if (!users[recipientId] || !users[recipientId].publicKey) {
        console.log("Публичный ключ не найден, запрашиваем у сервера...");
        requestPublicKey(recipientId);
        return;
    }

    const recipientPublicKey = users[recipientId].publicKey;
    const encryptedMessage = await encryptMessage(message, recipientPublicKey);

    sendToServer({ type: "message", recipientId, encryptedMessage });
}


