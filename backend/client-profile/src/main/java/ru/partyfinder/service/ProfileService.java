package ru.partyfinder.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import ru.partyfinder.config.UserContextHolder;
import ru.partyfinder.entity.User;
import ru.partyfinder.entity.Profile;
import ru.partyfinder.models.converter.ProfileConverter;
import ru.partyfinder.models.dto.ClientDTO;
import ru.partyfinder.models.dto.ProfileDTO;
import ru.partyfinder.models.dto.request.PutNewRatingDto;
import ru.partyfinder.repository.ProfileRepository;
import org.springframework.stereotype.Service;
import ru.partyfinder.repository.UserRepository;

import java.util.List;
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
    public ProfileDTO updateProfile(String username, ClientDTO clientDTO) {
        if (profileRepository.existsByUsername(username) && profileRepository.findByUsername(username).get().getIsConfirmed()) {
            updateUserProfileToNotConfirmed(username);
        }
        Profile existingProfile = getProfileByUsername(username);

        if (clientDTO.getName() != null && !clientDTO.getName().isEmpty()) {
            existingProfile.setName(clientDTO.getName());
        }
        if (clientDTO.getSurname() != null && !clientDTO.getSurname().isEmpty()) {
            existingProfile.setSurname(clientDTO.getSurname());
        }
        if (clientDTO.getPhone() != null && !clientDTO.getPhone().isEmpty()) {
            existingProfile.setPhone(clientDTO.getPhone());
        }
        if (clientDTO.getAboutMe() != null) {
            existingProfile.setAboutMe(clientDTO.getAboutMe());
        }
        if (clientDTO.getBirthDate() != null) {
            existingProfile.setBirthDate(clientDTO.getBirthDate());
        }

        Profile updatedProfile = profileRepository.save(existingProfile);
        return profileConverter.toProfileDTO(updatedProfile);
    }
    public void updateUserProfileToConfirmed(String username) {
        Profile profile = getProfileByUsername(username);
        profile.setIsConfirmed(true);
        profileRepository.save(profile);
    }

    public void updateUserProfileToNotConfirmed(String username) {
        Profile profile = getProfileByUsername(username);
        profile.setIsConfirmed(false);
        profileRepository.save(profile);
    }


    public ProfileDTO getProfile(String username) {
        return profileConverter.toProfileDTO(profileRepository.findByUsername(username).orElseThrow());
    }

    public Page<ProfileDTO> findProfilesByUsername(String username, Pageable pageable) {
        Page<Profile> profiles = profileRepository.findByUsernameContainingIgnoreCase(addProcents(username), pageable);
        log.info("Service -> getTotalPages -> " + profiles.getTotalPages());
        log.info("Service -> getTotalElements -> " + profiles.getTotalElements());
        return profiles.map(profileConverter::toProfileDTO);
    }

    public ProfileDTO getProfileId(UUID id) {
        return profileConverter.toProfileDTO(profileRepository.findById(id).orElse(null));
    }

    public Profile getProfileByUsername(String username) {
        return profileRepository.findByUsername(username).orElseThrow(
                () -> new IllegalArgumentException("Нет такого профиля человека")
        );
    }

    public List<Profile> getProfilesByUsernames(List<String> usernames) {
        return profileRepository.findByUsernames(usernames);
    }

    public void putNewRating(PutNewRatingDto putNewRatingDto) {
        Profile profile = profileRepository.findById(putNewRatingDto.getEntityId()).orElseThrow(RuntimeException::new);
        profile.setRating(putNewRatingDto.getRating());
        profileRepository.save(profile);
    }

    public void saveProfileWithMedia(Profile profile) {
        profileRepository.save(profile);
    }

    public boolean existByUsername(String username) {
        return profileRepository.existsByUsername(username);
    }

    private String addProcents(String username) {
        return "%" + username + "%";
    }

}
