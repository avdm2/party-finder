import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getChats } from "../../../api/ApiClientChat";
import "../../../styles/Chats.css";
import { Button, Avatar, TextField } from "@mui/material";
import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";

const Chats = () => {
    const navigate = useNavigate();
    const [chats, setChats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeChatId, setActiveChatId] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [stompClient, setStompClient] = useState(null);

    useEffect(() => {
        const fetchChats = async () => {
            try {
                const data = await getChats();
                if (Array.isArray(data)) {
                    setChats(data);
                } else {
                    throw new Error("Неправильный формат данных от API");
                }
                setError(null);
            } catch (err) {
                console.error("Ошибка при загрузке чатов:", err);
                setError("Чаты не найдены");
            } finally {
                setLoading(false);
            }
        };

        fetchChats();

        const token = localStorage.getItem("token");

        const socket = new SockJS("http://localhost:8727/ws");
        const client = Stomp.over(socket);
        client.connect({
            Authorization: `Bearer ${token}`
        }, (frame) => {
            console.log("Connected: " + frame);
            setStompClient(client);
        });

        return () => {
            if (client) {
                client.disconnect();
            }
        };
    }, []);

    useEffect(() => {
        if (activeChatId && stompClient) {
            stompClient.subscribe(`/topic/messages/${activeChatId}`, (message) => {
                const msg = JSON.parse(message.body);
                setMessages((prevMessages) => [...prevMessages, msg]);
            });
        }
    }, [activeChatId, stompClient]);

    useEffect(() => {
        if (activeChatId) {
            const fetchMessages = async () => {
                try {
                    const chat = chats.find(chat => chat.id === activeChatId);
                    if (chat) {
                        setMessages(chat.messages || []);
                    } else {
                        console.error("Чат не найден");
                    }
                } catch (err) {
                    console.error("Ошибка при загрузке сообщений:", err);
                }
            };

            fetchMessages();
        }
    }, [activeChatId, chats]);

    const handleChatClick = (chatId) => {
        setActiveChatId(chatId);
    };

    const handleSendMessage = () => {
        if (!newMessage.trim()) return;

        const token = localStorage.getItem("token");
        if (!token) {
            alert("Вы не авторизованы.");
            return;
        }

        const payload = JSON.parse(atob(token.split(".")[1]));
        const senderUsername = payload.sub;

        const messageDTO = {
            senderUsername: senderUsername,
            receiverUsername: chats.find(chat => chat.id === activeChatId)?.participants?.find(participant => participant.profile.username !== senderUsername)?.profile.username,
            content: newMessage
        };

        if (stompClient) {
            stompClient.send("/app/chat/" + activeChatId, {}, JSON.stringify(messageDTO));
            setNewMessage("");
        } else {
            console.error("Stomp клиент не подключен");
        }
    };

    return (
        <div className="chats-container">
            <div className="chat-list">
                <h2>Чаты</h2>
                {loading ? (
                    <div>Загрузка чатов...</div>
                ) : error ? (
                    <div>{error}</div>
                ) : chats.length === 0 ? (
                    <div>У вас нет ни одного чата</div>
                ) : (
                    chats.map((chat) => (
                        <div
                            key={chat.id}
                            className={`chat-item ${activeChatId === chat.id ? "active" : ""}`}
                            onClick={() => handleChatClick(chat.id)}
                        >
                            <Avatar src={`data:image/jpeg;base64,${chat.participants.find(participant => participant.profile.username !== localStorage.getItem("username")).profile.media.fileData}`} />
                            <div className="chat-info">
                                <h3>{chat.participants.find(participant => participant.profile.username !== localStorage.getItem("username")).profile.name} {chat.participants.find(participant => participant.profile.username !== localStorage.getItem("username")).profile.surname}</h3>
                                <p>{chat.messages.length > 0 ? chat.messages[chat.messages.length - 1].content : "Нет сообщений"}</p>
                            </div>
                        </div>
                    ))
                )}
            </div>
            {activeChatId && (
                <div className="chat-window">
                    <h2>Чат с {chats.find((chat) => chat.id === activeChatId)?.participants.find(participant => participant.profile.username !== localStorage.getItem("username")).profile.name}</h2>
                    <div className="messages-container">
                        {messages.map((msg) => (
                            <div key={msg.id} className={`message ${msg.sender.username === localStorage.getItem("username") ? "sent" : "received"}`}>
                                <Avatar src={`data:image/jpeg;base64,${msg.sender.media.fileData}`} />
                                <div className="message-content">
                                    <p>{msg.content}</p>
                                    <small>{new Date(msg.sentTime).toLocaleString()}</small>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="send-message-container">
                        <TextField
                            label="Новое сообщение"
                            variant="outlined"
                            fullWidth
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                        />
                        <Button variant="contained" color="primary" onClick={handleSendMessage}>
                            Отправить
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Chats;