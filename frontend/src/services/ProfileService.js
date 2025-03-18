import { createProfile } from "../utils/api";

export const useProfileService = () => {
    const handleCreateProfile = async (clientDTO) => {
        try {
            const profileId = await createProfile(clientDTO);
            alert(`Профиль успешно создан! Username: ${profileId}`);
        } catch (error) {
            alert("Произошла ошибка при создании профиля.");
            throw error;
        }
    };

    return { handleCreateProfile };
};

