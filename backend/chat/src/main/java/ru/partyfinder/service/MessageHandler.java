package ru.partyfinder.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class MessageHandler extends TextWebSocketHandler {
    private final Map<String, WebSocketSession> sessions = new ConcurrentHashMap<>();

    private final Map<String, String> publicKeys = new ConcurrentHashMap<>();


    @Override
    public void afterConnectionEstablished(WebSocketSession session) {
        String userId = session.getId();
        sessions.put(userId, session);
        System.out.println("Пользователь подключен: " + userId);
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        String payload = message.getPayload();
        System.out.println("Получено сообщение: " + payload);

        Map<String, Object> data = new ObjectMapper().readValue(payload, Map.class);

        String type = (String) data.get("type");
        switch (type) {
            case "public-key":
                String userId = session.getId();
                String publicKey = (String) data.get("key");
                publicKeys.put(userId, publicKey);
                System.out.println("Публичный ключ (" + publicKey +") сохранен для пользователя: " + userId);
                break;
            case "request-public-key":
                String recipientId = (String) data.get("userId");
                if (publicKeys.containsKey(recipientId)) {
                    String recipientPublicKey = publicKeys.get(recipientId);
                    session.sendMessage(new TextMessage(new ObjectMapper().writeValueAsString(Map.of(
                            "type", "public-key-response",
                            "userId", recipientId,
                            "key", recipientPublicKey
                    ))));
                } else {
                    session.sendMessage(new TextMessage(new ObjectMapper().writeValueAsString(Map.of(
                            "type", "error",
                            "message", "Публичный ключ не найден для пользователя: " + recipientId
                    ))));
                }
                break;
            case "message":
                String recipient = (String) data.get("recipientId");
                String encryptedMessage = (String) data.get("encryptedMessage");

                if (sessions.containsKey(recipient)) {
                    WebSocketSession recipientSession = sessions.get(recipient);
                    recipientSession.sendMessage(new TextMessage(new ObjectMapper().writeValueAsString(Map.of(
                            "type", "message",
                            "senderId", session.getId(),
                            "encryptedMessage", encryptedMessage
                    ))));
                } else {
                    session.sendMessage(new TextMessage(new ObjectMapper().writeValueAsString(Map.of(
                            "type", "error",
                            "message", "Пользователь с ID " + recipient + " не найден."
                    ))));
                }
                break;
            default:
                System.out.println("Неизвестный тип сообщения: " + type);
        }
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) {
        String userId = session.getId();
        sessions.remove(userId);
        publicKeys.remove(userId);
        System.out.println("Пользователь отключен: " + userId);
    }
}
