import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createOrganizerProfile } from "./CreateOrganizerProfile";
import { getOrganizerProfile } from "./GetOrganizerProfile";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";

function OrganizerProfile() {
    const [profile, setProfile] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [formData, setFormData] = useState({ name: "", surname: "", birthday: "", username: "" });
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) return navigate("/login");

        const payload = JSON.parse(atob(token.split(".")[1]));
        if (!payload.roles.includes("ORGANIZER")) return navigate("/homepage");

        getOrganizerProfile(payload.sub).then(data => {
            if (data) {
                setProfile(data);
            } else {
                setFormData(prev => ({ ...prev, username: payload.sub }));
                setModalOpen(true);
            }
        });
    }, [navigate]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        const formattedData = {
            ...formData,
            birthday: `${formData.birthday}T00:00:00` // Преобразуем в LocalDateTime
        };

        if (await createOrganizerProfile(formattedData)) {
            const updatedProfile = await getOrganizerProfile(formData.username);
            setProfile(updatedProfile);
            setModalOpen(false);
        }
    };


    return (
        <div>
            {profile ? (
                <div>
                    <h2>Профиль организатора</h2>
                    <p>Имя: {profile.name}</p>
                    <p>Фамилия: {profile.surname}</p>
                    <p>Дата рождения: {profile.birthday}</p>
                    {profile.media && (
                        <img src={`data:image/jpeg;base64,${profile.media.fileData}`} alt="Avatar" />
                    )}
                </div>
            ) : (
                <p>Загрузка...</p>
            )}
            <Dialog open={modalOpen} onClose={() => setModalOpen(false)}>
                <DialogTitle>Заполните профиль</DialogTitle>
                <DialogContent>
                    <TextField fullWidth margin="dense" label="Имя" name="name" onChange={handleChange} />
                    <TextField fullWidth margin="dense" label="Фамилия" name="surname" onChange={handleChange} />
                    <TextField fullWidth margin="dense" type="date" name="birthday" onChange={handleChange} InputLabelProps={{ shrink: true }} />
                    <TextField fullWidth margin="dense" label="Логин" name="username" value={formData.username} InputProps={{ readOnly: true }} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleSubmit} variant="contained" color="primary">Сохранить</Button>
                    <Button onClick={() => setModalOpen(false)} variant="outlined" color="secondary">Отмена</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
export default OrganizerProfile;