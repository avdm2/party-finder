package ru.partyfinder.organizerprofile.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import ru.partyfinder.organizerprofile.entity.OrganizerEntity;
import ru.partyfinder.organizerprofile.repository.OrganizerRepository;

import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class OrganizerService {

    private final OrganizerRepository organizerRepository;

    public OrganizerEntity createOrganizer(OrganizerEntity organizerEntity) {
        return organizerRepository.save(organizerEntity);
    }

    @SuppressWarnings("OptionalGetWithoutIsPresent")
    public OrganizerEntity findOrganizerByUsername(String username) {
        log.info("OrganizerService: findOrganizerByUsername: username={}", username);
        log.info("OrganizerService: findOrganizerByUsername: present={}",  organizerRepository.findByUsername(username).isPresent());
        return organizerRepository.findByUsername(username).orElse(null);
    }

    @SuppressWarnings("OptionalGetWithoutIsPresent")
    public OrganizerEntity findOrganizerById(UUID id) {
        log.info("OrganizerService: findOrganizerByUsername: id={}", id);
        return organizerRepository.findById(id).orElse(null);
    }


    public void saveOrganizerWithMedia(OrganizerEntity profile) {
        organizerRepository.save(profile);
    }
}
