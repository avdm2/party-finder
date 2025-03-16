package ru.partyfinder.organizerprofile.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import ru.partyfinder.organizerprofile.entity.OrganizerEntity;
import ru.partyfinder.organizerprofile.repository.OrganizerRepository;

@Service
@RequiredArgsConstructor
public class OrganizerService {

    private final OrganizerRepository organizerRepository;

    public OrganizerEntity createOrganizer(OrganizerEntity organizerEntity) {
        return organizerRepository.save(organizerEntity);
    }

    @SuppressWarnings("OptionalGetWithoutIsPresent")
    public OrganizerEntity findOrganizerByUsername(String username) {
        return organizerRepository.findByUsername(username).get();
    }

    public void saveOrganizerWithMedia(OrganizerEntity profile) {
        organizerRepository.save(profile);
    }
}
