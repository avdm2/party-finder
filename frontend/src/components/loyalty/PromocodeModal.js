import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button } from '@mui/material';

const PromocodeModal = ({ open, onClose, onCreate, organizerId }) => {
    const [newPromocode, setNewPromocode] = useState({
        value: '',
        bonusAmount: 0,
        numberOfUsage: 0,
    });

    const resetForm = () => {
        setNewPromocode({
            value: '',
            bonusAmount: 0,
            numberOfUsage: 0,
        });
    };

    const handleClose = () => {
        resetForm();
        onClose();
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
                onCreate(newCode);
                handleClose(); // Закрыть модальное окно и сбросить форму
            }
        } catch (error) {
            console.error("Ошибка при создании промокода:", error);
        }
    };

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Создание промокода</DialogTitle>
            <DialogContent>
                <TextField
                    fullWidth
                    margin="dense"
                    label="Название"
                    name="value"
                    value={newPromocode.value}
                    onChange={(e) =>
                        setNewPromocode((prev) => ({ ...prev, value: e.target.value }))
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
                        setNewPromocode((prev) => ({ ...prev, bonusAmount: e.target.value }))
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
                        setNewPromocode((prev) => ({ ...prev, numberOfUsage: e.target.value }))
                    }
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleCreatePromocode} variant="contained" color="primary">
                    Создать
                </Button>
                <Button onClick={handleClose} color="secondary">
                    Отмена
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default PromocodeModal;