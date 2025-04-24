import React, { useState } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    TextField,
    Button,
    Rating, Box, Typography,
} from "@mui/material";

const FeedbackModal = ({ selectedEvent, onClose }) => {
    const [feedbackFormData, setFeedbackFormData] = useState({
        avgBill: "",
        avgAge: "",
        avgTravelTimeInMinutes: "",
        rate: 1,
        peopleInGroup: "",
        avgSpentTimeInMinutes: "",
    });

    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFeedbackFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleRateChange = (event, newValue) => {
        setFeedbackFormData((prev) => ({ ...prev, rate: newValue }));
    };

    const validateForm = () => {
        const newErrors = {};
        const {
            avgBill,
            avgAge,
            avgTravelTimeInMinutes,
            rate,
            peopleInGroup,
            avgSpentTimeInMinutes,
        } = feedbackFormData;

        if (avgBill < 0 || avgBill > 1_000_000) {
            newErrors.avgBill = "Значение должно быть от 0 до 1 000 000";
        }
        if (avgAge < 0 || avgAge > 80) {
            newErrors.avgAge = "Значение должно быть от 0 до 80";
        }
        if (avgTravelTimeInMinutes < 1 || avgTravelTimeInMinutes > 24 * 60) {
            newErrors.avgTravelTimeInMinutes = "Значение должно быть от 1 до 1440 минут";
        }
        if (rate < 1 || rate > 5) {
            newErrors.rate = "Значение должно быть от 1 до 5";
        }
        if (peopleInGroup < 1 || peopleInGroup > 20) {
            newErrors.peopleInGroup = "Значение должно быть от 1 до 20";
        }
        if (avgSpentTimeInMinutes < 1 || avgSpentTimeInMinutes > 24 * 60) {
            newErrors.avgSpentTimeInMinutes = "Значение должно быть от 1 до 1440 минут";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmitFeedback = async () => {
        if (!validateForm()) return;

        try {
            const token = localStorage.getItem("token");
            const payload = {
                eventId: selectedEvent.id,
                avgBill: parseInt(feedbackFormData.avgBill),
                avgAge: parseInt(feedbackFormData.avgAge),
                avgTravelTimeInMinutes: parseInt(feedbackFormData.avgTravelTimeInMinutes),
                rate: feedbackFormData.rate,
                peopleInGroup: parseInt(feedbackFormData.peopleInGroup),
                avgSpentTimeInMinutes: parseInt(feedbackFormData.avgSpentTimeInMinutes),
            };

            const response = await fetch("http://localhost:8722/api/v1/organizers/analytics/add-data", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                alert("Фидбек успешно отправлен!");
                onClose();
            } else {
                alert("Ошибка при отправке фидбека.");
            }
        } catch (error) {
            console.error("Ошибка:", error);
            alert("Произошла ошибка при отправке фидбека.");
        }
    };

    return (
        <Dialog open onClose={onClose}>
            <DialogTitle>Оставить фидбек</DialogTitle>
            <DialogContent>
                <Typography variant="h6">{selectedEvent.title}</Typography>

                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <Typography variant="body1">Рейтинг:</Typography>
                    <Rating
                        name="rate"
                        value={feedbackFormData.rate}
                        onChange={handleRateChange}
                        size="large"
                        sx={{
                            "& .MuiRating-icon": {
                                color: "#ffcc00",
                                fontSize: "2rem",
                            },
                            "& .MuiRating-iconFilled": {
                                color: "#ffcc00",
                            },
                            "& .MuiRating-iconHover": {
                                color: "#ffdd33",
                            },
                        }}
                    />
                </Box>

                <TextField
                    fullWidth
                    margin="dense"
                    label="Средний чек (от 0 до 1 000 000)"
                    name="avgBill"
                    type="number"
                    placeholder={"1000"}
                    value={feedbackFormData.avgBill}
                    onChange={handleChange}
                    error={!!errors.avgBill}
                    helperText={errors.avgBill}
                    sx={{ mb: 2 }}
                />

                <TextField
                    fullWidth
                    margin="dense"
                    label="Средний возраст (от 0 до 80)"
                    placeholder={"10"}
                    name="avgAge"
                    type="number"
                    value={feedbackFormData.avgAge}
                    onChange={handleChange}
                    error={!!errors.avgAge}
                    helperText={errors.avgAge}
                    sx={{ mb: 2 }}
                />

                <TextField
                    fullWidth
                    margin="dense"
                    label="Среднее время в пути (в минутах, от 1 до 1440)"
                    placeholder={"20"}
                    name="avgTravelTimeInMinutes"
                    type="number"
                    value={feedbackFormData.avgTravelTimeInMinutes}
                    onChange={handleChange}
                    error={!!errors.avgTravelTimeInMinutes}
                    helperText={errors.avgTravelTimeInMinutes}
                    sx={{ mb: 2 }}
                />

                <TextField
                    fullWidth
                    margin="dense"
                    label="Количество людей в группе (от 1 до 20)"
                    name="peopleInGroup"
                    placeholder={"4"}
                    type="number"
                    value={feedbackFormData.peopleInGroup}
                    onChange={handleChange}
                    error={!!errors.peopleInGroup}
                    helperText={errors.peopleInGroup}
                    sx={{ mb: 2 }}
                />

                <TextField
                    fullWidth
                    margin="dense"
                    label="Среднее время на мероприятии (в минутах, от 1 до 1440)"
                    name="avgSpentTimeInMinutes"
                    type="number"
                    placeholder={"129"}
                    value={feedbackFormData.avgSpentTimeInMinutes}
                    onChange={handleChange}
                    error={!!errors.avgSpentTimeInMinutes}
                    helperText={errors.avgSpentTimeInMinutes}
                    sx={{ mb: 2 }}
                />

                <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
                    <Button onClick={onClose} variant="outlined" color="secondary">
                        Отмена
                    </Button>
                    <Button onClick={handleSubmitFeedback} variant="contained" color="primary">
                        Отправить
                    </Button>
                </Box>
            </DialogContent>
        </Dialog>
    );
};

export default FeedbackModal;