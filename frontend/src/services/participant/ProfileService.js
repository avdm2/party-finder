import { createProfile } from "../../utils/ApiClientProfile";
import {useNavigate} from "react-router-dom";


export const useProfileService = () => {
    const navigate = useNavigate();
    const handleCreateProfile = async (clientDTO) => {
        try {
            const token = localStorage.getItem("token");
            const profileId = await createProfile(clientDTO, token);
            navigate("/profile/me")
        } catch (error) {
            throw error;
        }
    };

    return { handleCreateProfile };
};

