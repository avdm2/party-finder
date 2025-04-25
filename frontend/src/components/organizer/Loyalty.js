import React, {useState, useEffect, useRef, useCallback} from 'react';
import { useParams } from 'react-router-dom';
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
    ListItemText,
    ListItemSecondaryAction,
    IconButton,
    DialogActions,
} from '@mui/material';
import PromocodeItem from './loyalty/PromocodeItem';
import PrizeItem from './loyalty/PrizeItem';
import PromocodeModal from './loyalty/PromocodeModal';
import CreatePrizeModal from './loyalty/PrizeModal';
import EmptyState from "../EmptyState";
import { scrollContainerStyle } from "./loyalty/scrollContainerStyle";
import QueueModal from "./loyalty/QueueModal";
import {
    CancelButton, CompleteButton,
    CreateEventButton,
    DialogTitleStyled,
    EventsContainer,
    StyledDialog
} from "../../styles/EventsPage.styles";

const Loyalty = () => {
    const [activePromocodes, setActivePromocodes] = useState([]);
    const [inactivePromocodes, setInactivePromocodes] = useState([]);
    const activePromocodesRef = useRef(null);
    const inactivePromocodesRef = useRef(null);
    const activePrizesRef = useRef(null);
    const inactivePrizesRef = useRef(null);
    const { organizerId } = useParams();
    const [promocodeModalOpen, setPromocodeModalOpen] = useState(false);
    const [prizeModalOpen, setPrizeModalOpen] = useState(false);
    const [activePrizes, setActivePrizes] = useState([]);
    const [inactivePrizes, setInactivePrizes] = useState([]);
    const [queueOpen, setQueueOpen] = useState(false);
    const [queueList, setQueueList] = useState([]);

    const fetchPromocodes = async (isActive) => {
        try {
            const token = localStorage.getItem("token");
            const url = `http://localhost:8711/api/v1/loyalty/promocode/getAll/${organizerId}${
                !isActive ? '?onlyOff=true' : ''
            }`;
            const response = await fetch(url, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (response.ok) {
                const data = await response.json();
                isActive
                    ? setActivePromocodes(data.filter(p => p.isActive))
                    : setInactivePromocodes(data.filter(p => !p.isActive));
            }
        } catch (error) {
            console.error(`Ошибка загрузки промокодов:`, error);
        }
    };

    const fetchPrizes = async (isActive) => {
        try {
            const token = localStorage.getItem("token");
            const url = `http://localhost:8711/api/v1/loyalty/prize/items/${organizerId}${
                !isActive ? '?onlyOff=true' : ''
            }`;
            const response = await fetch(url, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (response.ok) {
                const data = await response.json();
                isActive
                    ? setActivePrizes(data.filter(p => p.needToShow))
                    : setInactivePrizes(data.filter(p => !p.needToShow));
            }
        } catch (error) {
            console.error(`Ошибка загрузки призов:`, error);
        }
    };

    useEffect(() => {
        fetchPromocodes(true);
        fetchPromocodes(false);
        fetchPrizes(true);
        fetchPrizes(false);
    }, [organizerId]);

    const handleDeactivatePromocode = async (promoValue) => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`http://localhost:8711/api/v1/loyalty/promocode/off/${promoValue}`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                throw new Error('Ошибка деактивации промокода');
            }
            const deactivatedPromo = await response.json();
            setActivePromocodes((prevActive) =>
                prevActive.filter((promo) => promo.value !== promoValue)
            );
            setInactivePromocodes((prevInactive) => [...prevInactive, deactivatedPromo]);
        } catch (error) {
            console.error("Ошибка:", error);
            alert("Не удалось деактивировать промокод. Попробуйте позже.");
        }
    };

    const handleTogglePrize = async (prizeUuid) => {
        try {
            const token = localStorage.getItem("token");
            const prize = activePrizes.find(p => p.id === prizeUuid) || inactivePrizes.find(p => p.id === prizeUuid);
            const needToShow = !prize.needToShow;

            const response = await fetch(`http://localhost:8711/api/v1/loyalty/prize/changeVision/${prizeUuid}?vision=${needToShow}`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Ошибка переключения состояния приза');
            }

            const updatedPrize = await response.json();
            if (needToShow) {
                setActivePrizes(prev => [...prev, updatedPrize]);
                setInactivePrizes(prev => prev.filter(p => p.id !== prizeUuid));
            } else {
                setInactivePrizes(prev => [...prev, updatedPrize]);
                setActivePrizes(prev => prev.filter(p => p.id !== prizeUuid));
            }
        } catch (error) {
            console.error("Ошибка:", error);
            alert("Не удалось переключить состояние приза. Попробуйте позже.");
        }
    };

    const fetchQueue = useCallback(async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`http://localhost:8711/api/v1/loyalty/prize/history/list/${organizerId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (response.ok) {
                const data = await response.json();

                setQueueList(data);
            }
        } catch (error) {
            console.error("Ошибка загрузки очереди:", error);
        }
    }, [organizerId]);

    const handleQueueUpdate = useCallback(async (updater) => {
        if (typeof updater === 'function') {
            setQueueList(prev => updater(prev));
        } else {
            await fetchQueue();
        }
    }, [fetchQueue]);

    return (
        <EventsContainer>
            <Typography variant="h4" sx={{ color: "#2c3e50", fontWeight: 700 }}>
                Система лояльности
            </Typography>
            <Box sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: 2,
                mb: 4,
                mt: 2,
                width: '100%'
            }}>
                <CreateEventButton
                    variant="contained"
                    onClick={() => setPromocodeModalOpen(true)}
                    sx={{
                        minWidth: 200,
                        justifyContent: 'center'
                    }}
                >
                    Создать промокод
                </CreateEventButton>

                <CreateEventButton
                    variant="contained"
                    color="secondary"
                    onClick={() => setPrizeModalOpen(true)}
                    sx={{
                        minWidth: 200,
                        justifyContent: 'center'
                    }}
                >
                    Создать приз
                </CreateEventButton>

                <CreateEventButton
                    variant="contained"
                    color="info"
                    onClick={async () => {
                        await fetchQueue();
                        setQueueOpen(true);
                    }}
                    sx={{
                        minWidth: 200,
                        justifyContent: 'center'
                    }}
                >
                    Очередь
                </CreateEventButton>
            </Box>

            <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
                Активные промокоды
            </Typography>
            <Box ref={activePromocodesRef} sx={scrollContainerStyle}>
                {activePromocodes.length > 0 ? (
                    activePromocodes.map((promocode) => (
                        <PromocodeItem
                            key={promocode.id}
                            promocode={promocode}
                            onDeactivate={handleDeactivatePromocode}
                        />
                    ))
                ) : (
                    <EmptyState message="Активных промокодов пока нет" />
                )}
            </Box>

            <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
                Неактивные промокоды
            </Typography>
            <Box ref={inactivePromocodesRef} sx={scrollContainerStyle}>
                {inactivePromocodes.length > 0 ? (
                    inactivePromocodes.map((promocode) => (
                        <PromocodeItem
                            key={promocode.id}
                            promocode={promocode}
                            onDeactivate={null}
                        />
                    ))
                ) : (
                    <EmptyState message="Неактивных промокодов пока нет" />
                )}
            </Box>
            <QueueModal
                open={queueOpen}
                onClose={() => setQueueOpen(false)}
                queueList={queueList}
                onUpdateQueue={handleQueueUpdate}
            />
            <Typography variant="h5" sx={{ mt: 4 }}>
                Активные призы
            </Typography>
            {activePrizes.length > 0 ? (
                <Box ref={activePrizesRef} sx={scrollContainerStyle}>
                    {activePrizes.map((prize) => (
                        <Grid item xs={12} sm={6} md={4} key={prize.id}>
                            <PrizeItem
                                prize={prize}
                                onToggle={handleTogglePrize}
                                onImageUpload={async (prizeUuid, file) => {
                                    try {
                                        const token = localStorage.getItem("token");
                                        const formData = new FormData();
                                        formData.append("file", file);
                                        formData.append("prizeUuid", prizeUuid);
                                        const response = await fetch('http://localhost:8711/api/v1/loyalty/media/uploadPhoto', {
                                            method: 'POST',
                                            headers: {
                                                Authorization: `Bearer ${token}`,
                                            },
                                            body: formData,
                                        });
                                        if (!response.ok) {
                                            throw new Error('Ошибка загрузки изображения');
                                        }
                                    } catch (error) {
                                        console.error("Ошибка:", error);
                                    }
                                }}
                                ToggleButton={CompleteButton}
                                CancelButton={CancelButton}
                            />
                        </Grid>
                    ))}
                </Box>
            ) : (
                <Box sx={{ textAlign: "center", mt: 3 }}>
                    <Typography variant="body1">Призов пока нет</Typography>
                </Box>
            )}
            <Typography variant="h5" sx={{ mt: 4 }}>
                Неактивные призы
            </Typography>
            {inactivePrizes.length > 0 ? (
                <Box ref={inactivePrizesRef} sx={scrollContainerStyle}>
                    {inactivePrizes.map((prize) => (
                        <Grid item xs={12} sm={6} md={4} key={prize.id}>
                            <PrizeItem
                                prize={prize}
                                onToggle={handleTogglePrize}
                                onImageUpload={async (prizeUuid, file) => {
                                    try {
                                        const token = localStorage.getItem("token");
                                        const formData = new FormData();
                                        formData.append("file", file);
                                        formData.append("prizeUuid", prizeUuid);
                                        const response = await fetch('http://localhost:8711/api/v1/loyalty/prize/uploadPhoto', {
                                            method: 'POST',
                                            headers: {
                                                Authorization: `Bearer ${token}`,
                                            },
                                            body: formData,
                                        });
                                        if (!response.ok) {
                                            throw new Error('Ошибка загрузки изображения');
                                        }
                                    } catch (error) {
                                        console.error("Ошибка:", error);
                                    }
                                }}
                                ToggleButton={CompleteButton}
                                CancelButton={CancelButton}
                            />
                        </Grid>
                    ))}
                </Box>
            ) : (
                <Box sx={{ textAlign: "center", mt: 3 }}>
                    <Typography variant="body1">Неактивных призов нет</Typography>
                </Box>
            )}
            <PromocodeModal
                open={promocodeModalOpen}
                onClose={() => setPromocodeModalOpen(false)}
                onCreate={(newCode) => {
                    setActivePromocodes(prev => [...prev, newCode]);
                }}
                organizerId={organizerId}
                DialogComponent={StyledDialog}
                TitleComponent={DialogTitleStyled}
            />

            <CreatePrizeModal
                open={prizeModalOpen}
                onClose={() => setPrizeModalOpen(false)}
                onCreate={async (newPrize) => {
                    try {
                        const token = localStorage.getItem("token");
                        const response = await fetch('http://localhost:8711/api/v1/loyalty/prize/add', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                Authorization: `Bearer ${token}`,
                            },
                            body: JSON.stringify(newPrize),
                        });
                        if (response.ok) {
                            const createdPrize = await response.json();
                            setActivePrizes(prev => [...prev, createdPrize]);
                        }
                    } catch (error) {
                        console.error("Ошибка при создании приза:", error);
                    }
                }}
                organizerId={organizerId}
                DialogComponent={StyledDialog}
                TitleComponent={DialogTitleStyled}
            />
        </EventsContainer>
    );
};

export default Loyalty;