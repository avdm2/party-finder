import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const ChannelInterface = () => {
    const { channelId } = useParams();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await fetch(`http://localhost:8123/api/chat/channel/${channelId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const data = await response.json();
                setMessages(data);
            } catch (error) {
                console.error("Ошибка при загрузке сообщений:", error);
            }
        };
        fetchMessages();
    }, [channelId]);

    const handleSendMessage = async () => {
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
                setNewMessage('');
                const updatedMessages = [...messages, { content: newMessage }];
                setMessages(updatedMessages);
            } else {
                alert("Ошибка при отправке сообщения.");
            }
        } catch (error) {
            console.error("Ошибка при отправке сообщения:", error);
        }
    };

    return (
        <div className="channel-interface">
            <h2>Сообщения в канале</h2>
            <ul>
                {messages.map((msg, index) => (
                    <li key={index}>{msg.content}</li>
                ))}
            </ul>
            <div className="message-input">
                <input
                    type="text"
                    placeholder="Введите сообщение..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                />
                <button onClick={handleSendMessage}>Отправить</button>
            </div>
        </div>
    );
};

export default ChannelInterface;