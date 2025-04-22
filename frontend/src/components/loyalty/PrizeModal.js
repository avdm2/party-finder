import React, {useState} from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    TextField,
    DialogActions,
    Button,
} from '@mui/material';

const CreatePrizeModal = ({open, onClose, onCreate, organizerId}) => {
    const [form, setForm] = useState({});

    const handleCreate = async () => {
        try {
            const newPrize = {
                ownerUUID: organizerId,
                ...form,
                needToShow: true,
            };
            await onCreate(newPrize);
            onClose();
        } catch (error) {
            alert('Ошибка создания приза');
        }
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Создание приза</DialogTitle>
            <DialogContent>
                <TextField
                    fullWidth
                    margin="dense"
                    label="Название"
                    type="value"
                    placeholder="Приз"
                    value={form.title || ""}
                    onChange={(e) => setForm({...form, title: e.target.value})}
                />
                <TextField
                    fullWidth
                    margin="dense"
                    label="Описание"
                    type="value"
                    placeholder="Описание приза"
                    value={form.description || ""}
                    onChange={(e) => setForm({...form, description: e.target.value})}
                />
                <TextField
                    fullWidth
                    margin="dense"
                    label="Стоимость в баллах"
                    type="number"
                    placeholder="0"
                    value={form.bonusCost || ""}
                    onChange={(e) => setForm({...form, bonusCost: e.target.value})}
                />
                <TextField
                    fullWidth
                    margin="dense"
                    label="Количество"
                    type="number"
                    placeholder="0"
                    value={form.amount || ""}
                    onChange={(e) => setForm({...form, amount: e.target.value})}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleCreate} variant="contained" color="primary">
                    Создать
                </Button>
                <Button onClick={onClose} color="secondary">
                    Отмена
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default CreatePrizeModal;