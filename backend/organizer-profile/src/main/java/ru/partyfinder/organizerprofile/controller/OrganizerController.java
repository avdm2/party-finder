package ru.partyfinder.organizerprofile.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.partyfinder.organizerprofile.config.security.UserContextHolder;
import ru.partyfinder.organizerprofile.entity.OrganizerEntity;
import ru.partyfinder.organizerprofile.messaging.event.CredentialsChangesEvent;
import ru.partyfinder.organizerprofile.messaging.producer.CredentialsChangesEventProducer;
import ru.partyfinder.organizerprofile.model.dto.request.PutNewRatingDto;
import ru.partyfinder.organizerprofile.service.OrganizerService;

import java.util.UUID;

@Slf4j
@RestController
@RequestMapping("/api/v1/organizer")
@RequiredArgsConstructor
public class OrganizerController {

    private final CredentialsChangesEventProducer credentialsChangesEventProducer;
    private final OrganizerService organizerService;

    @PostMapping("/credentials/update")
    public ResponseEntity<Void> produce(@RequestBody CredentialsChangesEvent payload) {
        credentialsChangesEventProducer.produce(payload);
        return ResponseEntity.ok().build();
    }

    @PostMapping
    public ResponseEntity<OrganizerEntity> createOrganizer(@RequestBody OrganizerEntity organizer) {
        return ResponseEntity.ok(organizerService.createOrganizer(organizer));
    }

    @GetMapping("/username/{username}")
    public ResponseEntity<OrganizerEntity> getOrganizerByUsername(@PathVariable("username") String username) {
        var org = organizerService.findOrganizerByUsername(username);

        return org == null ? ResponseEntity.notFound().build() : ResponseEntity.ok(org);
    }

    @GetMapping("/me")
    public ResponseEntity<OrganizerEntity> getProfileMe() {
      String username = UserContextHolder.getContext().getUsername();
        return ResponseEntity.ok(organizerService.findOrganizerByUsername(username));
    }

    @GetMapping("/search")
    public Page<OrganizerEntity> searchProfilesByUsername(
            @RequestParam String username,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size) {

        log.info("Controller -> username -> " + username);

        Pageable pageable = PageRequest.of(page, size);

        return organizerService.findProfilesByUsernamePagable(username, pageable);
    }

    @GetMapping("/id/{id}")
    public ResponseEntity<OrganizerEntity> getOrganizerByUsername(@PathVariable("id") UUID id) {
        var org = organizerService.findOrganizerById(id);
        return org == null ? ResponseEntity.notFound().build() : ResponseEntity.ok(org);
    }

    @PostMapping("/putNewRating")
    public void putNewRating(@RequestBody PutNewRatingDto putNewRatingDto) {
        organizerService.putNewRating(putNewRatingDto);
    }
}
