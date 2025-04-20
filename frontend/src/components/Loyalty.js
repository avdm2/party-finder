import React, {useState, useEffect, useRef} from 'react';
import {useParams} from 'react-router-dom';
import CloseIcon from '@mui/icons-material/Close';
import {
    Box,
    Typography,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    TextField,
    DialogActions,
    Grid,
    Paper,
    IconButton,
} from '@mui/material';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import EmptyState from "./EmptyState";

const PromocodeItem = ({promocode, onDeactivate}) => {
    const isInactive = promocode.isActive === false;
    return (
        <Paper
            elevation={3}
            sx={{
                p: 2,
                position: 'relative',
                textAlign: "center",
                minWidth: 200,
                flexShrink: 0,
                transition: 'transform 0.2s',
                backgroundColor: isInactive ? '#f5f5f5' : '#fff',
                '&:first-of-type': {ml: 2},
                '&:last-of-type': {mr: 2},
                '&:hover': {transform: 'scale(1.02)'}
            }}
        >
            {!isInactive && onDeactivate && (
                <IconButton
                    sx={{
                        position: 'absolute',
                        top: 4,
                        right: 4,
                        padding: '4px',
                        color: 'text.secondary',
                        '&:hover': {
                            color: 'error.main',
                            backgroundColor: 'rgba(0, 0, 0, 0.04)'
                        }
                    }}
                    onClick={() => onDeactivate(promocode.value)}
                >
                    <CloseIcon fontSize="small"/>
                </IconButton>
            )}
            <Typography
                variant="body1"
                sx={{textDecoration: isInactive ? 'line-through' : 'none'}}
            >
                {promocode.value}
            </Typography>
            <Typography variant="body2">Баланс: {promocode.bonusAmount}</Typography>
            <Typography variant="body2">
                Изначальное количество: {promocode.initialNumberOfUsage}
            </Typography>
            <Typography variant="body2">
                Оставшееся количество: {promocode.numberOfUsage}
            </Typography>
        </Paper>
    );
};

const Loyalty = () => {
    const [activePromocodes, setActivePromocodes] = useState([]);
    const [inactivePromocodes, setInactivePromocodes] = useState([]);
    const activePromocodesRef = useRef(null);
    const inactivePromocodesRef = useRef(null);

    const {organizerId} = useParams();
    const [promocodeModalOpen, setPromocodeModalOpen] = useState(false);
    const [newPromocode, setNewPromocode] = useState({
        value: '',
        bonusAmount: 0,
        numberOfUsage: 0,
        initialNumberOfUsage: 0,
    });
    const [activePrizes, setActivePrizes] = useState([]);
    const [inactivePrizes, setInactivePrizes] = useState([]);
    const [prizeImage, setPrizeImage] = useState(null);
    const [promocodes, setPromocodes] = useState([]);
    const promocodesContainerRef = useRef(null);

    useEffect(() => {
        const fetchActivePromocodes = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await fetch(`http://localhost:8711/api/v1/loyalty/promocode/getAll/${organizerId}`, {
                    headers: {Authorization: `Bearer ${token}`},
                });
                if (response.ok) {
                    const data = await response.json();
                    const active = data.filter(p => p.isActive);
                    setActivePromocodes(active);
                }
            } catch (error) {
                console.error("Ошибка загрузки активных промокодов:", error);
            }
        };
        fetchActivePromocodes();
    }, [organizerId]);

    useEffect(() => {
        const fetchInactivePromocodes = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await fetch(
                    `http://localhost:8711/api/v1/loyalty/promocode/getAll/${organizerId}?onlyOff=true`,
                    {headers: {Authorization: `Bearer ${token}`}}
                );
                if (response.ok) {
                    const data = await response.json();
                    const inactive = data.filter(p => !p.isActive);
                    setInactivePromocodes(inactive);
                }
            } catch (error) {
                console.error("Ошибка загрузки неактивных промокодов:", error);
            }
        };
        fetchInactivePromocodes();
    }, [organizerId]);

    useEffect(() => {
        if (promocodesContainerRef.current) {
            promocodesContainerRef.current.scrollLeft = promocodesContainerRef.current.scrollWidth;
        }
    }, [promocodes]);

    useEffect(() => {
        const fetchActivePromocodes = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await fetch(`http://localhost:8711/api/v1/loyalty/promocode/getAll/${organizerId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (response.ok) {
                    const data = await response.json();
                    const active = data.filter(p => p.isActive);
                    setActivePromocodes(active);
                }
            } catch (error) {
                console.error("Ошибка загрузки активных промокодов:", error);
            }
        };
        fetchActivePromocodes();
    }, [organizerId]);

    useEffect(() => {
        const fetchInactivePromocodes = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await fetch(
                    `http://localhost:8711/api/v1/loyalty/promocode/getAll/${organizerId}?onlyOff=true`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                if (response.ok) {
                    const data = await response.json();
                    const inactive = data.filter(p => !p.isActive);
                    setInactivePromocodes(inactive);
                }
            } catch (error) {
                console.error("Ошибка загрузки неактивных промокодов:", error);
            }
        };
        fetchInactivePromocodes();
    }, [organizerId]);

    const handleAddPrize = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch('http://localhost:8711/api/v1/loyalty/prize/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    ownerUUID: organizerId,
                    bonusCost: 100,
                    amount: 1,
                    needToShow: true,
                }),
            });
            if (response.ok) {
                alert("Приз успешно добавлен!");
                window.location.reload();
            } else {
                alert("Ошибка при добавлении приза.");
            }
        } catch (error) {
            console.error("Ошибка при добавлении приза:", error);
        }
    };

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPrizeImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleCreatePromocode = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch('http://localhost:8711/api/v1/loyalty/promocode/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    ownerUUID: organizerId,
                    ...newPromocode,
                    initialNumberOfUsage: newPromocode.numberOfUsage,
                    isActive: true
                }),
            });

            if (response.ok) {
                const newCode = await response.json();
                setActivePromocodes(prev => [...prev, newCode]);
                setPromocodeModalOpen(false);
                setNewPromocode({ value: '', bonusAmount: 0, numberOfUsage: 0 });

                setTimeout(() => {
                    if (activePromocodesRef.current) {
                        activePromocodesRef.current.scrollTo({
                            left: activePromocodesRef.current.scrollWidth,
                            behavior: 'smooth'
                        });
                    }
                }, 100);
            }
        } catch (error) {
            console.error("Ошибка при создании промокода:", error);
        }
    };

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

    const scrollContainerStyle = {
        display: 'flex',
        overflowX: 'auto',
        gap: 2,
        py: 2,
        px: 2,
        mx: -2,
        width: 'calc(100% + 32px)',
        scrollBehavior: 'smooth',
        '&::-webkit-scrollbar': {
            height: '6px',
        },
        '&::-webkit-scrollbar-track': {
            background: '#f1f1f1',
            borderRadius: '3px',
        },
        '&::-webkit-scrollbar-thumb': {
            background: '#888',
            borderRadius: '3px',
            '&:hover': {
                background: '#555',
            }
        },
        scrollbarWidth: 'thin',
        scrollbarColor: '#888 #f1f1f1',
    };

    useEffect(() => {
        const scrollToEnd = (ref) => {
            if (ref.current) {
                ref.current.scrollTo({
                    left: ref.current.scrollWidth,
                    behavior: 'smooth'
                });
            }
        };

        scrollToEnd(activePromocodesRef);
        scrollToEnd(inactivePromocodesRef);
    }, [activePromocodes, inactivePromocodes]);

    {
        activePromocodes.length > 0 ? (
            activePromocodes.map((promocode) => (
                <PromocodeItem
                    key={promocode.id}
                    promocode={promocode}
                    onDeactivate={handleDeactivatePromocode}
                />
            ))
        ) : (
            <EmptyState message="Активных промокодов пока нет"/>
        )
    }

    useEffect(() => {
        if (activePromocodesRef.current) {
            activePromocodesRef.current.scrollLeft = activePromocodesRef.current.scrollWidth;
        }
    }, [activePromocodes]);

    useEffect(() => {
        if (inactivePromocodesRef.current) {
            inactivePromocodesRef.current.scrollLeft = inactivePromocodesRef.current.scrollWidth;
        }
    }, [inactivePromocodes]);

    return (
        <Box sx={{maxWidth: 800, margin: "auto", mt: 4}}>
            <Typography variant="h4" align="center" gutterBottom>
                Система лояльности
            </Typography>

            <Box sx={{display: "flex", justifyContent: "space-between", mb: 3}}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => setPromocodeModalOpen(true)}
                >
                    Создать промокод
                </Button>
                <Button
                    variant="contained"
                    color="secondary"
                    onClick={handleAddPrize}
                >
                    Создать приз
                </Button>
            </Box>

            <Typography variant="h5" gutterBottom sx={{mt: 4}}>
                Активные промокоды
            </Typography>
            <Box
                ref={activePromocodesRef}
                sx={scrollContainerStyle}
            >
                {activePromocodes.length > 0 ? (
                    activePromocodes.map((promocode) => (
                        <PromocodeItem
                            key={promocode.id}
                            promocode={promocode}
                            onDeactivate={handleDeactivatePromocode}
                        />
                    ))
                ) : (
                    <EmptyState message="Активных промокодов пока нет"/>
                )}
            </Box>

            <Typography variant="h5" gutterBottom sx={{mt: 4}}>
                Неактивные промокоды
            </Typography>
            <Box
                ref={inactivePromocodesRef}
                sx={scrollContainerStyle}
            >
                {inactivePromocodes.length > 0 ? (
                    inactivePromocodes.map((promocode) => (
                        <PromocodeItem
                            key={promocode.id}
                            promocode={promocode}
                            onDeactivate={null}
                        />
                    ))
                ) : (
                    <EmptyState message="Неактивных промокодов пока нет"/>
                )}
            </Box>

            <Typography variant="h5" sx={{mt: 4}}>
                Активные призы
            </Typography>
            {activePrizes.length > 0 ? (
                <Grid container spacing={2}>
                    {activePrizes.map((prize) => (
                        <Grid item xs={12} sm={6} md={4} key={prize.id}>
                            <Paper elevation={3} sx={{p: 2, textAlign: "center"}}>
                                <Box sx={{position: "relative", mb: 2}}>
                                    <img
                                        src={prizeImage || "https://via.placeholder.com/150"}
                                        alt="Приз"
                                        style={{
                                            width: "100%",
                                            height: "150px",
                                            objectFit: "cover",
                                            borderRadius: "8px",
                                        }}
                                    />
                                    <IconButton
                                        sx={{
                                            position: "absolute",
                                            bottom: 8,
                                            right: 8,
                                            backgroundColor: "rgba(0, 0, 0, 0.6)",
                                            color: "#fff",
                                            "&:hover": {backgroundColor: "rgba(0, 0, 0, 0.8)"},
                                        }}
                                        component="label"
                                    >
                                        <input
                                            type="file"
                                            hidden
                                            onChange={handleImageChange}
                                        />
                                        <AddPhotoAlternateIcon/>
                                    </IconButton>
                                </Box>
                                <Typography variant="body1">{prize.bonusCost} баллов</Typography>
                                <Typography variant="body2">Осталось: {prize.amount} шт.</Typography>
                                <Button
                                    variant="outlined"
                                    color="error"
                                    sx={{mt: 1}}
                                    onClick={() => {
                                    }}
                                >
                                    Отключить
                                </Button>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>
            ) : (
                <Box sx={{textAlign: "center", mt: 3}}>
                    <Typography variant="body1">Призов пока нет</Typography>
                </Box>
            )}

            <Typography variant="h5" sx={{mt: 4}}>
                Неактивные призы
            </Typography>
            {inactivePrizes.length > 0 ? (
                <Grid container spacing={2}>
                    {inactivePrizes.map((prize) => (
                        <Grid item xs={12} sm={6} md={4} key={prize.id}>
                            <Paper elevation={3} sx={{p: 2, textAlign: "center"}}>
                                <Box sx={{position: "relative", mb: 2}}>
                                    <img
                                        src={prizeImage || "https://via.placeholder.com/150"}
                                        alt="Приз"
                                        style={{
                                            width: "100%",
                                            height: "150px",
                                            objectFit: "cover",
                                            borderRadius: "8px",
                                        }}
                                    />
                                    <IconButton
                                        sx={{
                                            position: "absolute",
                                            bottom: 8,
                                            right: 8,
                                            backgroundColor: "rgba(0, 0, 0, 0.6)",
                                            color: "#fff",
                                            "&:hover": {backgroundColor: "rgba(0, 0, 0, 0.8)"},
                                        }}
                                        component="label"
                                    >
                                        <input
                                            type="file"
                                            hidden
                                            onChange={handleImageChange}
                                        />
                                        <AddPhotoAlternateIcon/>
                                    </IconButton>
                                </Box>
                                <Typography variant="body1">{prize.bonusCost} баллов</Typography>
                                <Typography variant="body2">Осталось: {prize.amount} шт.</Typography>
                                <Button
                                    variant="outlined"
                                    color="success"
                                    sx={{mt: 1}}
                                    onClick={() => {
                                    }}
                                >
                                    Включить
                                </Button>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>
            ) : (
                <Box sx={{textAlign: "center", mt: 3}}>
                    <Typography variant="body1">Неактивных призов нет</Typography>
                </Box>
            )}

            <Dialog open={promocodeModalOpen} onClose={() => setPromocodeModalOpen(false)}>
                <DialogTitle>Создание промокода</DialogTitle>
                <DialogContent>
                    <TextField
                        fullWidth
                        margin="dense"
                        label="Название"
                        name="value"
                        value={newPromocode.value}
                        onChange={(e) =>
                            setNewPromocode((prev) => ({...prev, value: e.target.value}))
                        }
                    />
                    <TextField
                        fullWidth
                        margin="dense"
                        label="Номинал"
                        placeholder="0"
                        type="number"
                        name="bonusAmount"
                        value={newPromocode.bonusAmount || ""}
                        onChange={(e) =>
                            setNewPromocode((prev) => ({...prev, bonusAmount: e.target.value}))
                        }
                    />
                    <TextField
                        fullWidth
                        margin="dense"
                        label="Количество использований"
                        type="number"
                        placeholder="0"
                        name="numberOfUsage"
                        value={newPromocode.numberOfUsage || ""}
                        onChange={(e) =>
                            setNewPromocode((prev) => ({...prev, numberOfUsage: e.target.value}))
                        }
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCreatePromocode} variant="contained" color="primary">
                        Создать
                    </Button>
                    <Button onClick={() => setPromocodeModalOpen(false)} color="secondary">
                        Отмена
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default Loyalty;