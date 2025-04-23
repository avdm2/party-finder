import React, { useState, useEffect } from "react";
import {
    Box,
    Typography,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Grid,
    Dialog,
    DialogTitle,
    DialogContent,
    List,
    ListItem,
    ListItemText,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useParams } from "react-router-dom";

const Analytics = () => {
    const [events, setEvents] = useState([]);
    const [eventData, setEventData] = useState({});
    const [allData, setAllData] = useState({});
    const [ratings, setRatings] = useState({});
    const [openModal, setOpenModal] = useState(false);
    const [modalData, setModalData] = useState([]);
    const [modalTitle, setModalTitle] = useState("");
    const { organizerId } = useParams();

    const fetchEvents = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`http://localhost:8722/api/organizers/event/list/${organizerId}`, {
                method: "GET",
                headers: { Authorization: `Bearer ${token}` },
            });
            if (response.ok) {
                const data = await response.json();
                setEvents(data);
            } else {
                console.error("Ошибка загрузки мероприятий");
            }
        } catch (error) {
            console.error("Ошибка:", error);
        }
    };

    const fetchEventData = async (eventId) => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`http://localhost:8722/api/organizers/analytics/${eventId}`, {
                method: "GET",
                headers: { Authorization: `Bearer ${token}` },
            });
            if (response.ok) {
                const data = await response.json();
                setEventData((prev) => ({ ...prev, [eventId]: data }));
            } else {
                console.error("Ошибка загрузки аналитических данных");
            }
        } catch (error) {
            console.error("Ошибка:", error);
        }
    };

    const fetchAllData = async (eventId) => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`http://localhost:8722/api/organizers/analytics/data/all/${eventId}`, {
                method: "GET",
                headers: { Authorization: `Bearer ${token}` },
            });
            if (response.ok) {
                const data = await response.json();
                setAllData((prev) => ({ ...prev, [eventId]: data }));
            } else {
                console.error("Ошибка загрузки всех данных");
            }
        } catch (error) {
            console.error("Ошибка:", error);
        }
    };

    const fetchEventRating = async (eventId) => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`http://localhost:8722/api/organizers/analytics/rating/${eventId}`, {
                method: "GET",
                headers: { Authorization: `Bearer ${token}` },
            });
            if (response.ok) {
                const rating = await response.json();
                setRatings((prev) => ({ ...prev, [eventId]: rating }));
            } else {
                console.error("Ошибка загрузки рейтинга");
            }
        } catch (error) {
            console.error("Ошибка:", error);
        }
    };
    const calculateMedian = (values) => {
        if (!values || values.length === 0) return 0;
        const sorted = [...values].sort((a, b) => a - b);
        const mid = Math.floor(sorted.length / 2);
        if (sorted.length % 2 === 0) {
            return ((sorted[mid - 1] + sorted[mid]) / 2).toFixed(2);
        }
        return sorted[mid].toFixed(2);
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    useEffect(() => {
        events.forEach((event) => {
            fetchEventData(event.id);
            fetchAllData(event.id);
            fetchEventRating(event.id);
        });
    }, [events]);

    const handleOpenModal = (title, data) => {
        setModalTitle(title);
        setModalData(data);
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        setModalData([]);
    };

    return (
        <Box sx={{ maxWidth: 800, margin: "auto", mt: 4 }}>
            <Typography variant="h4" align="center" gutterBottom>
                Аналитика мероприятий
            </Typography>

            {events.length === 0 ? (
                <Typography variant="body1" sx={{ mt: 4 }}>
                    Нет доступных мероприятий
                </Typography>
            ) : (
                events.map((event) => {
                    const data = eventData[event.id] || {};
                    const allDataForEvent = allData[event.id] || [];
                    const avgBills = allDataForEvent.map((d) => d.avgBill).filter(Boolean);
                    const avgAges = allDataForEvent.map((d) => d.avgAge).filter(Boolean);
                    const avgTravelTimes = allDataForEvent.map((d) => d.avgTravelTimeInMinutes).filter(Boolean);
                    const avgSpentTimes = allDataForEvent.map((d) => d.avgSpentTimeInMinutes).filter(Boolean);
                    const peopleInGroups = allDataForEvent.map((d) => d.peopleInGroup).filter(Boolean);

                    return (
                        <Accordion key={event.id}>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <Box
                                    sx={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        width: "100%",
                                    }}
                                >
                                    <Typography variant="h6">{event.title}</Typography>
                                    <Typography
                                        variant="body1"
                                        sx={{
                                            color: "#6a11cb",
                                            fontWeight: 600,
                                            ml: 2,
                                        }}
                                    >
                                        Рейтинг: {typeof ratings[event.id] === "number" ? ratings[event.id].toFixed(2) : "N/A"}
                                    </Typography>
                                </Box>
                            </AccordionSummary>
                            <AccordionDetails>
                                {eventData[event.id] ? (
                                    <Box sx={{ p: 2, border: "1px solid #e0e0e0", borderRadius: 4 }}>
                                        <Grid container spacing={2}>
                                            <Grid item xs={12} sm={6}>
                                                <Typography
                                                    variant="subtitle1"
                                                    sx={{ fontWeight: 600, cursor: "pointer", color: "#1976d2" }}
                                                    onClick={() => handleOpenModal("Средний чек", avgBills)}
                                                >
                                                    Средний чек:
                                                </Typography>
                                                <Typography variant="body1">
                                                    Среднее: {typeof data.avgBill === "number" ? data.avgBill.toFixed(2) : "N/A"} ₽
                                                </Typography>
                                                <Typography variant="body1">
                                                    Медиана: {calculateMedian(avgBills)} ₽
                                                </Typography>
                                            </Grid>

                                            <Grid item xs={12} sm={6}>
                                                <Typography
                                                    variant="subtitle1"
                                                    sx={{ fontWeight: 600, cursor: "pointer", color: "#1976d2" }}
                                                    onClick={() => handleOpenModal("Средний возраст участников", avgAges)}
                                                >
                                                    Средний возраст участников:
                                                </Typography>
                                                <Typography variant="body1">
                                                    Среднее: {typeof data.avgAge === "number" ? data.avgAge.toFixed(2) : "N/A"}
                                                </Typography>
                                                <Typography variant="body1">
                                                    Медиана: {calculateMedian(avgAges)}
                                                </Typography>
                                            </Grid>

                                            <Grid item xs={12} sm={6}>
                                                <Typography
                                                    variant="subtitle1"
                                                    sx={{ fontWeight: 600, cursor: "pointer", color: "#1976d2" }}
                                                    onClick={() => handleOpenModal("Среднее время в пути", avgTravelTimes)}
                                                >
                                                    Среднее время в пути:
                                                </Typography>
                                                <Typography variant="body1">
                                                    Среднее: {typeof data.avgTravelTimeInMinutes === "number" ? data.avgTravelTimeInMinutes.toFixed(2) : "N/A"} минут
                                                </Typography>
                                                <Typography variant="body1">
                                                    Медиана: {calculateMedian(avgTravelTimes)} минут
                                                </Typography>
                                            </Grid>

                                            <Grid item xs={12} sm={6}>
                                                <Typography
                                                    variant="subtitle1"
                                                    sx={{ fontWeight: 600, cursor: "pointer", color: "#1976d2" }}
                                                    onClick={() => handleOpenModal("Среднее время на мероприятии", avgSpentTimes)}
                                                >
                                                    Среднее время на мероприятии:
                                                </Typography>
                                                <Typography variant="body1">
                                                    Среднее: {typeof data.avgSpentTimeInMinutes === "number" ? data.avgSpentTimeInMinutes.toFixed(2) : "N/A"} минут
                                                </Typography>
                                                <Typography variant="body1">
                                                    Медиана: {calculateMedian(avgSpentTimes)} минут
                                                </Typography>
                                            </Grid>

                                            <Grid item xs={12} sm={6}>
                                                <Typography
                                                    variant="subtitle1"
                                                    sx={{ fontWeight: 600, cursor: "pointer", color: "#1976d2" }}
                                                    onClick={() => handleOpenModal("Среднее количество человек в группе", peopleInGroups)}
                                                >
                                                    Среднее количество человек в группе:
                                                </Typography>
                                                <Typography variant="body1">
                                                    Среднее: {typeof data.peopleInGroup === "number" ? data.peopleInGroup.toFixed(2) : "N/A"}
                                                </Typography>
                                                <Typography variant="body1">
                                                    Медиана: {calculateMedian(peopleInGroups)}
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                    </Box>
                                ) : (
                                    <Typography variant="body1">Загрузка данных...</Typography>
                                )}
                            </AccordionDetails>
                        </Accordion>
                    );
                })
            )}

            <Dialog open={openModal} onClose={handleCloseModal}>
                <DialogTitle>{modalTitle}</DialogTitle>
                <DialogContent>
                    {modalData.length > 0 ? (
                        <Typography variant="body1">
                            {modalData.join(" ")}
                        </Typography>
                    ) : (
                        <Typography variant="body1">Нет данных</Typography>
                    )}
                </DialogContent>
            </Dialog>
        </Box>
    );
};

export default Analytics;