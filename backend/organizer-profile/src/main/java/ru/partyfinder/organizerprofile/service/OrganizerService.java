package ru.partyfinder.organizerprofile.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import ru.partyfinder.organizerprofile.entity.OrganizerEntity;
import ru.partyfinder.organizerprofile.model.dto.request.PutNewRatingDto;
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

    public Page<OrganizerEntity> findProfilesByUsernamePagable(String username, Pageable pageable) {
        Page<OrganizerEntity> profiles = organizerRepository.findByUsernameContainingIgnoreCase(addProcents(username), pageable);
        log.info("Service -> getTotalPages -> " + profiles.getTotalPages());
        log.info("Service -> getTotalElements -> " + profiles.getTotalElements());
        return profiles;
    }

    @SuppressWarnings("OptionalGetWithoutIsPresent")
    public OrganizerEntity findOrganizerById(UUID id) {
        log.info("OrganizerService: findOrganizerByUsername: id={}", id);
        return organizerRepository.findById(id).orElse(null);
    }

    public void saveOrganizerWithMedia(OrganizerEntity profile) {
        organizerRepository.save(profile);
    }

    public void putNewRating(PutNewRatingDto putNewRatingDto) {
        OrganizerEntity organizer = organizerRepository.findById(putNewRatingDto.getEntityId()).orElseThrow(RuntimeException::new);
        organizer.setRating(putNewRatingDto.getRating());
        organizerRepository.save(organizer);
    }

    private String addProcents(String username) {
        return "%" + username + "%";
    }
}
