import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    Button,
    DialogActions,
    Typography,
    Box,
    Tabs,
    Tab,
    Divider
} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

const QueueModal = ({ open, onClose, queueList }) => {
    const [activeTab, setActiveTab] = useState(0);

    const pendingPrizes = queueList.filter(item => !item.delivered);
    const deliveredPrizes = queueList.filter(item => item.delivered);

    const handleDeliverPrize = async (prizeUuid, username, prizeHistoryId) => {
        try {
            const token = localStorage.getItem("token");
            const url = `http://localhost:8711/api/v1/loyalty/prize/history/deliver?id=${prizeHistoryId}`;

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.ok) {
                onClose();
            } else {
                throw new Error('Ошибка выдачи приза');
            }
        } catch (error) {
            console.error("Ошибка:", error);
            alert("Не удалось отметить приз как выданный.");
        }
    };

    const formatDeliveryTime = (timestamp) => {
        if (!timestamp) return '';
        const date = new Date(timestamp);
        return date.toLocaleString('ru-RU', {
            day: 'numeric',
            month: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="md"
            fullWidth
            sx={{
                '& .MuiDialog-paper': {
                    minHeight: 500
                }
            }}
        >
            <DialogTitle sx={{ borderBottom: '1px solid #eee' }}>
                <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
                    <Tab label={`Очередь (${pendingPrizes.length})`} />
                    <Tab label={`Отправленные (${deliveredPrizes.length})`} />
                </Tabs>
            </DialogTitle>

            <DialogContent sx={{ p: 0 }}>
                {activeTab === 0 && (
                    <List sx={{ width: '100%' }}>
                        {pendingPrizes.map((item) => (
                            <ListItem
                                key={`pending-${item.participantUsername}-${item.prizeUuid}`}
                                sx={{
                                    pr: 12,
                                    borderBottom: '1px solid #f5f5f5',
                                    '&:last-child': { borderBottom: 'none' }
                                }}
                            >
                                <ListItemText
                                    primary={`Пользователь: ${item.participantUsername}`}
                                    secondary={`ID: ${item.id}; Дата заказа: ${formatDeliveryTime(item.orderTimestamp) || "N/A"}; Приз: ${item.prizeTitle}`}
                                    sx={{ flexBasis: '70%' }}
                                />
                                <ListItemSecondaryAction sx={{ right: 16 }}>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        size="small"
                                        onClick={() => handleDeliverPrize(item.prizeUuid, item.participantUsername, item.id)}
                                    >
                                        Выдать
                                    </Button>
                                </ListItemSecondaryAction>
                            </ListItem>
                        ))}
                        {pendingPrizes.length === 0 && (
                            <Box sx={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Typography variant="body1" color="textSecondary">
                                    Нет призов для выдачи
                                </Typography>
                            </Box>
                        )}
                    </List>
                )}

                {activeTab === 1 && (
                    <List sx={{ width: '100%' }}>
                        {deliveredPrizes.map((item) => (
                            <ListItem
                                key={`delivered-${item.participantUsername}-${item.prizeUuid}`}
                                sx={{
                                    pr: 12,
                                    borderBottom: '1px solid #f5f5f5',
                                    '&:last-child': { borderBottom: 'none' }
                                }}
                            >
                                <ListItemText
                                    primary={`Пользователь: ${item.participantUsername}`}
                                    secondary={
                                        <>
                                            <Box component="span" display="block">
                                                ID: {item.id}
                                            </Box>
                                            <Box component="span" display="block">
                                                Приз: {item.prizeTitle}
                                            </Box>
                                            <Box component="span" display="block" sx={{ mt: 0.5 }}>
                                                <AccessTimeIcon sx={{ fontSize: 14, verticalAlign: 'middle', mr: 1 }} />
                                                {formatDeliveryTime(item.deliveredTimestamp)}
                                            </Box>
                                            <Box component="span" display="block" sx={{ mt: 0.5 }}>
                                               Дата заказа: {formatDeliveryTime(item.orderTimestamp) || "N/A"}
                                            </Box>
                                        </>
                                    }
                                    sx={{ flexBasis: '70%' }}
                                />
                                <ListItemSecondaryAction sx={{ right: 16 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', color: 'success.main' }}>
                                        <CheckIcon />
                                        <Typography variant="body2" sx={{ ml: 1 }}>
                                            Выдано
                                        </Typography>
                                    </Box>
                                </ListItemSecondaryAction>
                            </ListItem>
                        ))}
                        {deliveredPrizes.length === 0 && (
                            <Box sx={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Typography variant="body1" color="textSecondary">
                                    Нет отправленных призов
                                </Typography>
                            </Box>
                        )}
                    </List>
                )}
            </DialogContent>

            <DialogActions sx={{ p: 3 }}>
                <Button
                    variant="outlined"
                    onClick={onClose}
                    sx={{ minWidth: 120 }}
                >
                    Закрыть
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default QueueModal;