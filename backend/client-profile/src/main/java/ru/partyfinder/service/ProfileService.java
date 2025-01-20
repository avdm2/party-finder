package ru.partyfinder.service;

import lombok.RequiredArgsConstructor;
import ru.partyfinder.models.converter.ProfileConverter;
import ru.partyfinder.models.dto.ClientDTO;
import ru.partyfinder.models.dto.ProfileDTO;
import ru.partyfinder.repository.ProfileRepository;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ProfileService {

    private final ProfileRepository profileRepository;
    private final ProfileConverter profileConverter;
    public UUID createProfile(ClientDTO clientDTO) {
        return profileRepository.save(profileConverter.toProfile(clientDTO)).getId();
    }

    public ProfileDTO getProfile(UUID id) {
        return profileConverter.toProfileDTO(profileRepository.findById(id).orElseThrow());
    }

}
