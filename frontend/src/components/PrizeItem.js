import React from 'react';
import { Paper, Typography, Button, Box, IconButton } from '@mui/material';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';

const PrizeItem = ({ prize, handleImageChange }) => {
    return (
        <Paper elevation={3} sx={{ p: 2, textAlign: "center" }}>
            <Box sx={{ position: "relative", mb: 2 }}>
                <img
                    src={prize.image || "https://via.placeholder.com/150"}
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
                        "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.8)" },
                    }}
                    component="label"
                >
                    <input type="file" hidden onChange={handleImageChange} />
                    <AddPhotoAlternateIcon />
                </IconButton>
            </Box>
            <Typography variant="body1">{prize.bonusCost} баллов</Typography>
            <Typography variant="body2">Осталось: {prize.amount} шт.</Typography>
            <Button
                variant="outlined"
                color="success"
                sx={{ mt: 1 }}
                onClick={() => {}}
            >
                Включить
            </Button>
        </Paper>
    );
};

export default PrizeItem;