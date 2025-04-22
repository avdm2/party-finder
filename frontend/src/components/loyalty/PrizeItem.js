import React, {useState, useEffect} from 'react';
import {
    Paper,
    Typography,
    Button,
    IconButton,
    CircularProgress,
    Box,
} from '@mui/material';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import CloseIcon from '@mui/icons-material/Close';

const PrizeItem = ({prize, onToggle, onImageUpload}) => {
    const [imageLoading, setImageLoading] = useState(false);
    const [imageUrl, setImageUrl] = useState(null);

    useEffect(() => {
        const fetchImage = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await fetch(`http://localhost:8711/api/v1/loyalty/media/photo/${prize.id}`, {
                    headers: {Authorization: `Bearer ${token}`},
                });

                if (response.ok) {
                    const blob = await response.blob();
                    const imageUrl = URL.createObjectURL(blob);
                    setImageUrl(imageUrl);
                } else {
                    setImageUrl(null);
                }
            } catch (error) {
                console.error("Ошибка загрузки изображения:", error);
                setImageUrl(null);
            }
        };

        fetchImage();
    }, [prize.id]);

    const handleImageChange = async (event) => {
        const file = event.target.files[0];
        if (file) {
            setImageLoading(true);
            try {
                await onImageUpload(prize.id, file);
                const newImageUrl = URL.createObjectURL(file);
                setImageUrl(newImageUrl);
            } catch (error) {
                alert('Ошибка загрузки изображения');
            }
            setImageLoading(false);
        }
    };

    return (
        <Paper
            elevation={3}
            sx={{
                p: 2,
                textAlign: "center",
                position: 'relative',
                minWidth: 200,
                flexShrink: 0,
                transition: 'transform 0.2s',
                '&:hover': {transform: 'scale(1.02)'},
            }}
        >
            <IconButton
                sx={{
                    position: 'absolute',
                    top: 4,
                    right: 4,
                    '&:hover': {color: 'error.main'},
                }}
                onClick={() => onToggle(prize.id)}
            >
                <CloseIcon fontSize="small"/>
            </IconButton>

            <Box sx={{position: "relative", mb: 2}}>
                {imageLoading ? (
                    <CircularProgress sx={{height: 150, width: 150}}/>
                ) : (
                    <img
                        src={imageUrl || "https://www.shutterstock.com/image-vector/default-ui-image-placeholder-wireframes-600nw-1037719192.jpg"}
                        alt="Приз"
                        onError={(e) => {
                            e.target.src = "https://www.shutterstock.com/image-vector/default-ui-image-placeholder-wireframes-600nw-1037719192.jpg";
                        }}
                        style={{
                            width: "100%",
                            height: 150,
                            objectFit: "cover",
                            borderRadius: "8px",
                        }}
                    />
                )}
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
                        accept="image/*"
                    />
                    <AddPhotoAlternateIcon/>
                </IconButton>
            </Box>

            <Typography variant="body1">{prize.title}</Typography>
            <Typography variant="body2">{prize.description}</Typography>
            <Typography variant="body2">Стоимость: {prize.bonusCost}</Typography>
            <Typography variant="body2">Осталось: {prize.amount} шт.</Typography>

            <Button
                variant="outlined"
                color={prize.needToShow ? "error" : "success"}
                sx={{mt: 1}}
                onClick={() => onToggle(prize.id)}
            >
                {prize.needToShow ? "Отключить" : "Включить"}
            </Button>
        </Paper>
    );
};

export default PrizeItem;