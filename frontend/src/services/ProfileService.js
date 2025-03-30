import { createProfile } from "../utils/ApiClientProfile";

export const useProfileService = () => {
    const handleCreateProfile = async (clientDTO) => {
        try {
            const token = localStorage.getItem("token");
            const profileId = await createProfile(clientDTO, token);
            alert(`Профиль успешно создан! Username: ${profileId}`);
        } catch (error) {
            alert("Произошла ошибка при создании профиля.");
            throw error;
        }
    };

    return { handleCreateProfile };
};

