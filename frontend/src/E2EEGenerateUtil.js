import {sendToServer} from "./E2EE";

export let asymmetricKeyPair;

//генерация ассиметричных ключей (приватный и публичные)
export async function generateKeyPair() {
    asymmetricKeyPair = await crypto.subtle.generateKey(
        {
            name: "RSA-OAEP",
            modulusLength: 2048,
            publicExponent: new Uint8Array([1, 0, 1]),
            hash: "SHA-256"
        },
        true,
        ["encrypt", "decrypt"]
    );

    console.log("Keys generated:", asymmetricKeyPair);
}

export async function exportPublicKey(key) {
    const exported = await crypto.subtle.exportKey("spki", key);
    return btoa(String.fromCharCode(...new Uint8Array(exported))); // Base64
}

export async function initializeEncryption() {
    await generateKeyPair();
    const publicKeyBase64 = await exportPublicKey(asymmetricKeyPair.publicKey);
    sendToServer({ type: "public-key", key: publicKeyBase64 });
}


//получение ключа другого пользователя
export async function importPublicKey(base64Key) {
    const binaryKey = Uint8Array.from(atob(base64Key), (c) => c.charCodeAt(0));
    return crypto.subtle.importKey(
        "spki",
        binaryKey,
        { name: "RSA-OAEP", hash: "SHA-256" },
        true,
        ["encrypt"]
    );
}

export async function encryptMessage(message, recipientPublicKey) {
    const encodedMessage = new TextEncoder().encode(message);

    const encryptedMessage = await crypto.subtle.encrypt(
        { name: "RSA-OAEP" },
        recipientPublicKey,
        encodedMessage
    );

    return btoa(String.fromCharCode(...new Uint8Array(encryptedMessage)));
}

export async function decryptMessage(encryptedData) {
    const encryptedBytes = Uint8Array.from(atob(encryptedData), (c) => c.charCodeAt(0));

    const decryptedMessage = await crypto.subtle.decrypt(
        { name: "RSA-OAEP" },
        asymmetricKeyPair.privateKey,
        encryptedBytes
    );

    return new TextDecoder().decode(decryptedMessage);
}





