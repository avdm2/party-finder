import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getChats } from "../../../api/ApiClientChat";
import "../../../styles/Chats.css";
import { Button, Avatar, TextField } from "@mui/material";
import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";
import { toast } from "react-toastify";

const Chats = () => {
    const navigate = useNavigate();
    const [chats, setChats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeChatId, setActiveChatId] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [stompClient, setStompClient] = useState(null);
    const [currentUserProfile, setCurrentUserProfile] = useState(null);
    const messagesEndRef = useRef(null);
    const tempMessagesRef = useRef({});
    const participantsCache = useRef({});

    const token = localStorage.getItem("token");
    const payload = token ? JSON.parse(atob(token.split(".")[1])) : null;
    const currentUsername = payload?.sub || "";

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const sortMessagesByTime = (messages) => {
        return [...messages].sort((a, b) => {
            return new Date(a.sentTime).getTime() - new Date(b.sentTime).getTime();
        });
    };

    const getCurrentUserProfile = (chats) => {
        for (const chat of chats) {
            const participant = chat.participants?.find(
                p => p.profile.username === currentUsername
            );
            if (participant) {
                return participant.profile;
            }
        }
        return null;
    };

    const updateLastMessageInChats = (chatId, message, tempMessage) => {
        setChats(prevChats => {
            return prevChats.map(chat => {
                if (chat.id === chatId) {
                    const lastMessage = {
                        id: message.id,
                        content: message.content,
                        sentTime: message.sentTime,
                        sender: tempMessage?.sender || message.sender,
                        receiver: message.receiver,
                        chatId: message.chatId
                    };

                    return {
                        ...chat,
                        lastMessage,
                        messages: activeChatId === chatId
                            ? sortMessagesByTime([...(chat.messages || []).filter(m => m.id !== `temp-${message.tempId}`), lastMessage])
                            : chat.messages
                    };
                }
                return chat;
            });
        });
    };

    const handleChatClick = (chatId) => {
        setActiveChatId(chatId);
    };

    const getOtherParticipant = (chat) => {
        if (!chat) return null;

        if (participantsCache.current[chat.id]) {
            return participantsCache.current[chat.id];
        }

        const participant = chat.participants?.find(
            p => p.profile.username !== currentUsername
        )?.profile;

        if (participant) {
            participantsCache.current[chat.id] = participant;
        }

        return participant;
    };

    const renderAvatar = (profile) => {
        if (!profile?.media?.fileData) {
            return (
                <Avatar sx={{ bgcolor: "grey.300" }}>
                    {profile?.name?.[0]}{profile?.surname?.[0]}
                </Avatar>
            );
        }
        return (
            <Avatar
                src={`data:${profile.media.mimeType};base64,${profile.media.fileData}`}
                alt={`${profile.name} ${profile.surname}`}
            />
        );
    };

    useEffect(() => {
        const fetchChats = async () => {
            try {
                const data = await getChats();
                const currentProfile = getCurrentUserProfile(data);
                setCurrentUserProfile(currentProfile);

                data.forEach(chat => {
                    const participant = chat.participants?.find(
                        p => p.profile.username !== currentUsername
                    )?.profile;
                    if (participant) {
                        participantsCache.current[chat.id] = participant;
                    }
                });

                const formattedChats = data.map(chat => ({
                    ...chat,
                    lastMessage: chat.messages && chat.messages.length > 0
                        ? sortMessagesByTime(chat.messages)[chat.messages.length - 1]
                        : null
                }));
                setChats(formattedChats);
                setError(null);
            } catch (err) {
                console.error("Error loading chats:", err);
                setError("Failed to load chats");
            } finally {
                setLoading(false);
            }
        };
        fetchChats();

        if (token) {
            const socket = new SockJS("http://localhost:8727/ws");
            const client = Stomp.over(socket);
            client.connect({ Authorization: `Bearer ${token}` }, () => {
                setStompClient(client);
            });
            return () => {
                if (client && client.connected) {
                    client.disconnect();
                }
            };
        }
    }, []);

    useEffect(() => {
        if (!stompClient) return;

        const chatSubscription = activeChatId ? stompClient.subscribe(
            `/topic/messages/${activeChatId}`,
            (message) => {
                const msg = JSON.parse(message.body);
                const tempMessage = tempMessagesRef.current[msg.tempId];
                const chat = chats.find(c => c.id === msg.chatId);
                const sender = msg.sender?.username === currentUsername
                    ? currentUserProfile
                    : getOtherParticipant(chat);

                const completeMessage = {
                    ...msg,
                    sender: {
                        ...(tempMessage?.sender || msg.sender || {}),
                        ...sender,
                        username: msg.sender?.username || sender?.username
                    }
                };

                setMessages(prev => {
                    const filtered = prev.filter(m => m.id !== `temp-${msg.tempId}`);
                    return sortMessagesByTime([...filtered, completeMessage]);
                });

                updateLastMessageInChats(msg.chatId, completeMessage, tempMessage);
                delete tempMessagesRef.current[msg.tempId];
            }
        ) : null;

        const userSubscription = stompClient.subscribe(
            `/user/queue/messages`,
            (message) => {
                const msg = JSON.parse(message.body);
                const tempMessage = tempMessagesRef.current[msg.tempId];
                const chat = chats.find(c => c.id === msg.chatId);
                const sender = msg.sender?.username === currentUsername
                    ? currentUserProfile
                    : getOtherParticipant(chat);

                const completeMessage = {
                    ...msg,
                    sender: {
                        ...(tempMessage?.sender || msg.sender || {}),
                        ...sender,
                        username: msg.sender?.username || sender?.username
                    }
                };

                if (activeChatId === msg.chatId) {
                    setMessages(prev => {
                        const filtered = prev.filter(m => m.id !== `temp-${msg.tempId}`);
                        return sortMessagesByTime([...filtered, completeMessage]);
                    });
                } else {
                    toast.info(`Новое сообщение от ${sender?.name || 'Unknown'}: ${msg.content.substring(0, 30)}...`);
                }

                updateLastMessageInChats(msg.chatId, completeMessage, tempMessage);
                delete tempMessagesRef.current[msg.tempId];
            }
        );

        return () => {
            chatSubscription?.unsubscribe();
            userSubscription?.unsubscribe();
        };
    }, [stompClient, activeChatId, chats, currentUserProfile]);

    useEffect(() => {
        if (activeChatId) {
            const chat = chats.find(c => c.id === activeChatId);
            if (chat?.messages) {
                setMessages(sortMessagesByTime(chat.messages));
                setTimeout(scrollToBottom, 100);
            } else {
                setMessages([]);
            }
        }
    }, [activeChatId, chats]);

    const handleSendMessage = () => {
        if (!newMessage.trim() || !activeChatId || !stompClient || !currentUserProfile) return;
        const chat = chats.find(c => c.id === activeChatId);
        const receiver = getOtherParticipant(chat);
        if (!receiver) return;

        const tempId = Date.now();
        const tempMessage = {
            id: `temp-${tempId}`,
            content: newMessage,
            sentTime: new Date().toISOString(),
            sender: {
                username: currentUsername,
                name: currentUserProfile.name,
                surname: currentUserProfile.surname,
                media: currentUserProfile.media
            },
            receiver: {
                username: receiver.username,
                name: receiver.name,
                surname: receiver.surname,
                media: receiver.media
            },
            chatId: activeChatId,
            isTemp: true,
            tempId: tempId
        };

        setMessages(prev => sortMessagesByTime([...prev, tempMessage]));
        updateLastMessageInChats(activeChatId, tempMessage, null);
        tempMessagesRef.current[tempId] = tempMessage;

        stompClient.send(
            `/app/chat/${activeChatId}`,
            {},
            JSON.stringify({
                content: newMessage,
                senderUsername: currentUsername,
                receiverUsername: receiver.username,
                chatId: activeChatId,
                tempId: tempId
            })
        );

        setNewMessage("");
    };

    return (
        <div className="chats-container">
            <div className="chat-list">
                <h2>Чаты</h2>
                {loading ? (
                    <div>Loading...</div>
                ) : error ? (
                    <div>{error}</div>
                ) : chats.length === 0 ? (
                    <div>No chats found</div>
                ) : (
                    chats.map(chat => {
                        const otherParticipant = getOtherParticipant(chat);
                        const lastMessage = chat.lastMessage;
                        return (
                            <div
                                key={chat.id}
                                className={`chat-item ${activeChatId === chat.id ? "active" : ""}`}
                                onClick={() => handleChatClick(chat.id)}
                            >
                                {otherParticipant && renderAvatar(otherParticipant)}
                                <div className="chat-info">
                                    <h3>{otherParticipant?.name} {otherParticipant?.surname}</h3>
                                    <p>{lastMessage?.content || "No messages"}</p>
                                    <small>
                                        {lastMessage?.sentTime
                                            ? new Date(lastMessage.sentTime).toLocaleTimeString()
                                            : ""}
                                    </small>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
            {activeChatId && (
                <div className="chat-window">
                    <div className="messages-container">
                        {messages.map(msg => (
                            <div
                                key={msg.id}
                                className={`message ${msg.sender?.username === currentUsername ? "sent" : "received"} ${msg.isTemp ? "temp-message" : ""}`}
                            >
                                {renderAvatar(msg.sender)}
                                <div className="message-content">
                                    <p>{msg.content}</p>
                                    <small>
                                        {new Date(msg.sentTime).toLocaleTimeString()}
                                        {msg.isTemp && <span> (отправка...)</span>}
                                    </small>
                                </div>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>
                    <div className="message-input">
                        <TextField
                            fullWidth
                            variant="outlined"
                            placeholder="Type a message..."
                            value={newMessage}
                            onChange={e => setNewMessage(e.target.value)}
                            onKeyPress={e => e.key === 'Enter' && handleSendMessage()}
                        />
                        <Button
                            variant="contained"
                            onClick={handleSendMessage}
                            disabled={!newMessage.trim()}
                        >
                            Отправить
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Chats;