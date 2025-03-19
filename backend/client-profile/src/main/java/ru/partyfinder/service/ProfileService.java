package ru.partyfinder.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import ru.partyfinder.config.UserContextHolder;
import ru.partyfinder.entity.User;
import ru.partyfinder.entity.Profile;
import ru.partyfinder.models.converter.ProfileConverter;
import ru.partyfinder.models.dto.ClientDTO;
import ru.partyfinder.models.dto.ProfileDTO;
import ru.partyfinder.repository.ProfileRepository;
import org.springframework.stereotype.Service;
import ru.partyfinder.repository.UserRepository;

import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class ProfileService {

    private final ProfileRepository profileRepository;

    private final ProfileConverter profileConverter;

    private final UserRepository userRepository;
    public void createProfile(ClientDTO clientDTO) {
        String username = UserContextHolder.getContext().getUsername();
        User user = userRepository.findByUsername(username).orElseThrow(
                () -> new IllegalArgumentException("Нет такого зарегистрирвоанного пользователя")
        );
        clientDTO.setUsername(user.getUsername());
        clientDTO.setEmail(user.getEmail());
        clientDTO.setName(user.getFirstname());
        clientDTO.setSurname(user.getLastname());
        log.info(clientDTO.toString());
        profileRepository.save(profileConverter.toProfile(clientDTO));
    }

    public ProfileDTO getProfile(String username) {
        return profileConverter.toProfileDTO(profileRepository.findByUsername(username).orElseThrow());
    }

    public ProfileDTO getProfile(UUID id) {
        return profileConverter.toProfileDTO(profileRepository.findById(id).orElseThrow());
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
