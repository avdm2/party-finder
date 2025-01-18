package org.example.service;

import lombok.RequiredArgsConstructor;
import org.example.models.converter.ProfileConverter;
import org.example.models.dto.ClientDTO;
import org.example.models.dto.ProfileDTO;
import org.example.repository.ProfileRepository;
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
