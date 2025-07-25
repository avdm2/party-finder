import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import {
    Box,
    Typography,
    List,
    ListItem,
    ListItemText,
    TextField,
    Button,
    Paper,
    Divider,
} from '@mui/material';
import { useAuth } from "../auth/AuthContext";

const ChannelInterface = () => {
    const { channelId } = useParams();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef(null);
    const [channelName, setChannelName] = useState('');
    const [subscriberCount, setSubscriberCount] = useState(0);
    const [isSubscribed, setIsSubscribed] = useState(false);
    const { role } = useAuth();

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) return;

                if (role === 'PARTICIPANT') {
                    await fetchMessagesForClient();
                    await checkSubscription();
                } else {
                    const payload = JSON.parse(atob(token.split(".")[1]));
                    const ownerUsername = payload.sub;

                    const channelResponse = await fetch(`http://localhost:8123/api/chat/owner/${ownerUsername}`, {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    if (channelResponse.ok) {
                        const channelData = await channelResponse.json();
                        setChannelName(channelData.name || '');
                    }

                    const subscribersResponse = await fetch(`http://localhost:8123/api/chat/channel/${channelId}/subscribers`, {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    if (subscribersResponse.ok) {
                        const subscribers = await subscribersResponse.json();
                        setSubscriberCount(subscribers.length);
                    }

                    const response = await fetch(`http://localhost:8123/api/chat/channel/${channelId}`, {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    if (response.ok) {
                        const data = await response.json();
                        setMessages(data);
                    } else {
                        console.error("Ошибка при загрузке сообщений:", response.status);
                    }
                }
            } catch (error) {
                console.error("Ошибка при загрузке сообщений:", error);
            }
        };
        fetchMessages();
    }, [channelId, role]);

    const fetchMessagesForClient = async () => {
        const token = localStorage.getItem("token");
        try {
            const subscribersResponse = await fetch(`http://localhost:8123/api/chat/channel/${channelId}/subscribers`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (subscribersResponse.ok) {
                const subscribers = await subscribersResponse.json();
                setSubscriberCount(subscribers.length);
            }

            const response = await fetch(`http://localhost:8123/api/chat/channel/${channelId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (response.ok) {
                const data = await response.json();
                setMessages(data);
            } else {
                console.error("Ошибка при загрузке сообщений:", response.status);
            }
        } catch (error) {
            console.error("Ошибка при загрузке сообщений:", error);
        }
    };

    const checkSubscription = async () => {
        const token = localStorage.getItem("token");
        const payload = JSON.parse(atob(token.split(".")[1]));
        const subscriberUsername = payload.sub;

        try {
            const response = await fetch(`http://localhost:8123/api/chat/is-subscribed/${channelId}/${subscriberUsername}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (response.ok) {
                const data = await response.json();
                setIsSubscribed(data);
            }
        } catch (error) {
            console.error("Ошибка при проверке подписки:", error);
        }
    };

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    const handleSendMessage = async () => {
        if (!newMessage.trim()) return;

        try {
            const token = localStorage.getItem("token");
            const response = await fetch('http://localhost:8123/api/chat/send', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ channelId, content: newMessage }),
            });

            if (response.ok) {
                const updatedMessages = [...messages, { content: newMessage, createdAt: new Date().toISOString() }];
                setMessages(updatedMessages);
                setNewMessage('');
            } else {
                alert("Ошибка при отправке сообщения.");
            }
        } catch (error) {
            console.error("Ошибка при отправке сообщения:", error);
        }
    };

    const handleSubscribe = async () => {
        const token = localStorage.getItem("token");
        const payload = JSON.parse(atob(token.split(".")[1]));
        const subscriberUsername = payload.sub;

        try {
            const response = await fetch(`http://localhost:8123/api/chat/subscribe`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ channelId, subscriberUsername }),
            });

            if (response.ok) {
                setIsSubscribed(true);
                alert("Вы успешно подписались на канал.");
            } else {
                alert("Ошибка при подписке на канал.");
            }
        } catch (error) {
            console.error("Ошибка при подписке на канал:", error);
            alert("Произошла ошибка при подписке на канал.");
        }
    };

    const handleUnsubscribe = async () => {
        const token = localStorage.getItem("token");
        const payload = JSON.parse(atob(token.split(".")[1]));
        const subscriberUsername = payload.sub;

        try {
            const response = await fetch(`http://localhost:8123/api/chat/unsubscribe`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ channelId, subscriberUsername }),
            });

            if (response.ok) {
                setIsSubscribed(false);
                alert("Вы успешно отписались от канала.");
            } else {
                alert("Ошибка при отписке от канала.");
            }
        } catch (error) {
            console.error("Ошибка при отписке от канала:", error);
            alert("Произошла ошибка при отписке от канала.");
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return date.toLocaleString("ru-RU", options);
    };

    return (
        <Box sx={{ maxWidth: 600, margin: "auto", mt: 4 }}>
            <Typography variant="h5" align="center" gutterBottom>
                {channelName}
            </Typography>
            <Typography variant="body1" align="center" color="text.secondary" gutterBottom>
                Подписчики: {subscriberCount}
            </Typography>
            <Paper elevation={3} sx={{ maxHeight: 400, overflowY: 'auto', p: 2 }}>
                <List>
                    {messages.length === 0 ? (
                        <Typography variant="body1" color="text.secondary">
                            Нет сообщений в канале.
                        </Typography>
                    ) : (
                        messages.map((msg, index) => (
                            <React.Fragment key={index}>
                                <ListItem alignItems="flex-start">
                                    <Paper
                                        elevation={2}
                                        sx={{
                                            borderRadius: 2,
                                            padding: 1.5,
                                            backgroundColor: '#e3f2fd',
                                            maxWidth: '70%',
                                        }}
                                    >
                                        <ListItemText
                                            primary={
                                                <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                                                    {msg.content}
                                                </Typography>
                                            }
                                            secondary={
                                                <Typography
                                                    component="span"
                                                    variant="body2"
                                                    color="text.secondary"
                                                    sx={{ fontSize: '0.8rem' }}
                                                >
                                                    {msg.createdAt && formatDate(msg.createdAt)}
                                                </Typography>
                                            }
                                        />
                                    </Paper>
                                </ListItem>
                                <Divider variant="inset" component="li" />
                            </React.Fragment>
                        ))
                    )}
                    <div ref={messagesEndRef}></div>
                </List>
            </Paper>

            {role === 'PARTICIPANT' && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                    {isSubscribed ? (
                        <Button
                            variant="contained"
                            color="secondary"
                            onClick={handleUnsubscribe}
                            sx={{ mr: 2 }}
                        >
                            Отписаться
                        </Button>
                    ) : (
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleSubscribe}
                            sx={{ mr: 2 }}
                        >
                            Подписаться
                        </Button>
                    )}
                </Box>
            )}

            {role !== 'PARTICIPANT' && (
                <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                    <TextField
                        fullWidth
                        variant="outlined"
                        placeholder="Введите сообщение..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSendMessage}
                        disabled={!newMessage.trim()}
                    >
                        Отправить
                    </Button>
                </Box>
            )}
        </Box>
    );
};

export default ChannelInterface;