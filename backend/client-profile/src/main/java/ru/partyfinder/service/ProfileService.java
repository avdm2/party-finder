package ru.partyfinder.service;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetailsService;
import ru.partyfinder.entity.Profile;
import ru.partyfinder.models.converter.ProfileConverter;
import ru.partyfinder.models.dto.ClientDTO;
import ru.partyfinder.models.dto.ProfileDTO;
import ru.partyfinder.repository.ProfileRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ProfileService {

    private final ProfileRepository profileRepository;
    private final ProfileConverter profileConverter;
    public String createProfile(ClientDTO clientDTO) {
        // TODO заолнить username в clientDTO из токена
        return profileRepository.save(profileConverter.toProfile(clientDTO)).getUsername();
    }

    public ProfileDTO getProfile(String username) {
        return profileConverter.toProfileDTO(profileRepository.findByUsername(username).orElseThrow());
    }

    public Profile getProfileByUsername(String username) {
        return profileRepository.findByUsername(username).orElseThrow(
                () -> new IllegalArgumentException("Нет такого профиля человека")
        );
    }

    public void saveProfileWithMedia(Profile profile) {
        profileRepository.save(profile);
    }

    public boolean existByUsername(String username) {
        return profileRepository.existsByUsername(username);
    }


}
