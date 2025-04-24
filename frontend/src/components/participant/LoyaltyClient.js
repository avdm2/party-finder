import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
    Box,
    Typography,
    Button,
    Grid,
    Dialog,
    DialogTitle,
    DialogContent,
    List,
    ListItem,
    ListItemText, DialogActions,
} from "@mui/material";
import { EventsContainer, CreateEventButton, SubmitButton } from "../../styles/EventsPage.styles";

const LoyaltyClient = () => {
    const { organizerId } = useParams();
    const [bonusBalance, setBonusBalance] = useState(0);
    const [promoCode, setPromoCode] = useState("");
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState("");
    const [prizes, setPrizes] = useState([]);
    const [queueOpen, setQueueOpen] = useState(false);
    const [queueList, setQueueList] = useState([]);

    useEffect(() => {
        const fetchBonusBalance = async () => {
            try {
                console.log("Fetch бонусный баланс");
                const token = localStorage.getItem("token");
                const payload = JSON.parse(atob(token.split(".")[1]));
                const username = payload.sub;
                const response = await fetch(
                    `http://localhost:8711/api/v1/loyalty/balance/${organizerId}?username=${username}`,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );
                if (response.ok) {
                    const data = await response.json();
                    setBonusBalance(data.bonusAmount);
                }
            } catch (err) {
                console.error("Ошибка загрузки баланса:", err);
            }
        };
        fetchBonusBalance();
    }, [organizerId]);

    useEffect(() => {
        const fetchPrizes = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await fetch(
                    `http://localhost:8711/api/v1/loyalty/prize/items/${organizerId}`,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );
                if (response.ok) {
                    const data = await response.json();
                    setPrizes(data.filter((prize) => prize.needToShow));
                }
            } catch (err) {
                console.error("Ошибка загрузки призов:", err);
            }
        };
        fetchPrizes();
    }, [organizerId]);

    const handlePromoSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccessMessage("");
        try {
            const token = localStorage.getItem("token");
            const payload = JSON.parse(atob(token.split(".")[1]));
            const username = payload.sub;
            const response = await fetch(
                `http://localhost:8711/api/v1/loyalty/promocode/redeem/${promoCode}?username=${username}`,
                {
                    method: "GET",
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            if (!response.ok) {
                throw new Error("Неверный промокод");
            }
            const updatedBalance = await response.json();
            setBonusBalance(updatedBalance.bonusAmount);
            setPromoCode("");
            setSuccessMessage("Промокод активирован");
        } catch (err) {
            setError(err.message);
        }
    };

    const handleOrderPrize = async (prizeId) => {
        try {
            const token = localStorage.getItem("token");
            const payload = JSON.parse(atob(token.split(".")[1]));
            const username = payload.sub;
            const response = await fetch(
                `http://localhost:8711/api/v1/loyalty/prize/order/${prizeId}?username=${username}`,
                {
                    method: "GET",
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Ошибка заказа приза");
            }
            const updatedBalance = await response.json();
            setBonusBalance(updatedBalance.bonusAmount);
            alert("Приз успешно заказан!");
        } catch (err) {
            alert(`Ошибка: ${err.message}`);
        }
    };

    const fetchQueue = async () => {
        try {
            const token = localStorage.getItem("token");
            const payload = JSON.parse(atob(token.split(".")[1]));
            const username = payload.sub;
            const response = await fetch(
                `http://localhost:8711/api/v1/loyalty/prize/history/list/${organizerId}`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            if (response.ok) {
                const data = await response.json();
                const filteredData = data.filter((item) => item.participantUsername === username);
                setQueueList(filteredData);
            }
        } catch (err) {
            console.error("Ошибка загрузки очереди:", err);
        }
    };

    return (
        <EventsContainer>
            <Typography variant="h4" sx={{ color: "#2c3e50", fontWeight: 700 }}>
                Система лояльности
            </Typography>
            <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
                Ваш баланс: {bonusBalance?.toLocaleString('ru-RU') || "N/A"} баллов
            </Typography>
            <Box component="form" onSubmit={handlePromoSubmit} sx={{ mt: 4 }}>
                <input
                    type="text"
                    placeholder="Введите промокод"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    style={{
                        borderColor: error ? "red" : "",
                        borderWidth: 2,
                        padding: "8px",
                        borderRadius: "4px",
                        width: "100%",
                    }}
                />
                <CreateEventButton type="submit">Активировать</CreateEventButton>
                <CreateEventButton
                    onClick={async () => {
                        await fetchQueue();
                        setQueueOpen(true);
                    }}
                    sx={{ ml: 2 }}
                >
                    Очередь
                </CreateEventButton>
                {error && <p style={{ color: "red" }}>{error}</p>}
                {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
            </Box>

            <Dialog open={queueOpen} onClose={() => setQueueOpen(false)}>
                <DialogTitle>Список заказанных призов</DialogTitle>
                <DialogContent>
                    {queueList.length > 0 ? (
                        <List>
                            {queueList.map((item) => (
                                <ListItem key={item.id}>
                                    <ListItemText
                                        primary={item.prizeTitle}
                                        secondary={
                                            <>
                                                {item.delivered ? (
                                                    <span style={{ color: "green" }}>Доставлен</span>
                                                ) : (
                                                    <span style={{ color: "red" }}>Не доставлен</span>
                                                )}
                                                <br />
                                                <span style={{ fontSize: "0.9em", color: "#666" }}>
                                                    Заказан:{" "}
                                                    {new Date(item.orderTimestamp).toLocaleString("ru-RU", {
                                                        year: "numeric",
                                                        month: "long",
                                                        day: "numeric",
                                                        hour: "2-digit",
                                                        minute: "2-digit",
                                                    })}
                                                </span>
                                            </>
                                        }
                                    />
                                </ListItem>
                            ))}
                        </List>
                    ) : (
                        <Typography>Заказанные призы отсутствуют.</Typography>
                    )}
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <Button
                        variant="outlined"
                        onClick={() => setQueueOpen(false)}
                        sx={{ minWidth: 120 }}
                    >
                        Закрыть
                    </Button>
                </DialogActions>
            </Dialog>

            <Typography variant="h5" sx={{ mt: 4 }}>
                Доступные призы:
            </Typography>
            <Box sx={{ mt: 4 }}>
                <Grid container spacing={2}>
                    {prizes.length > 0 ? (
                        prizes.map((prize) => (
                            <Grid item xs={12} sm={6} md={4} key={prize.id}>
                                <Box
                                    sx={{
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "center",
                                        p: 2,
                                        border: "1px solid #ccc",
                                        borderRadius: "8px",
                                        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
                                        transition: "all 0.3s ease",
                                        height: "350px",
                                        "&:hover": {
                                            transform: "translateY(-3px)",
                                            boxShadow: "0 8px 20px rgba(106, 17, 203, 0.1)",
                                        },
                                    }}
                                >
                                    <img
                                        src={
                                            prize.media && prize.media.fileData
                                                ? `data:image/jpeg;base64,${prize.media.fileData}`
                                                : "https://www.shutterstock.com/image-vector/default-ui-image-placeholder-wireframes-600nw-1037719192.jpg"
                                        }
                                        alt={prize.title}
                                        onError={(e) => {
                                            e.target.src = "https://www.shutterstock.com/image-vector/default-ui-image-placeholder-wireframes-600nw-1037719192.jpg";
                                        }}
                                        style={{
                                            width: "100%",
                                            height: "150px",
                                            marginBottom: "10px",
                                            borderRadius: "8px",
                                            objectFit: "cover",
                                        }}
                                    />
                                    <Typography variant="h6">{prize.title}</Typography>
                                    <Typography variant="body1">{prize.description}</Typography>
                                    <Typography variant="body1">
                                        Стоимость: {prize.bonusCost} баллов
                                    </Typography>
                                    <Typography variant="body1">
                                        Количество: {prize.amount} шт
                                    </Typography>
                                    <SubmitButton
                                        onClick={() => handleOrderPrize(prize.id)}
                                        disabled={bonusBalance < prize.bonusCost}
                                        sx={{
                                            mt: 2,
                                            background: bonusBalance >= prize.bonusCost ? "linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)" : "#ccc",
                                            color: bonusBalance >= prize.bonusCost ? "#fff" : "#000",
                                            "&:hover": {
                                                background: bonusBalance >= prize.bonusCost ? "linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)" : "#ccc",
                                            },
                                        }}
                                    >
                                        Заказать
                                    </SubmitButton>
                                </Box>
                            </Grid>
                        ))
                    ) : (
                        <Box sx={{ textAlign: "center", mt: 3 }}>
                            <Typography variant="body1">Призов пока нет</Typography>
                        </Box>
                    )}
                </Grid>
            </Box>
        </EventsContainer>
    );
};

export default LoyaltyClient;