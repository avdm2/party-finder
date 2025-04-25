import {IconButton, Paper, Typography} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import React from "react";

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

export default PromocodeItem;