package ru.partyfinder.organizerprofile.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ru.partyfinder.organizerprofile.entity.OrganizerEntity;
import ru.partyfinder.organizerprofile.messaging.event.CredentialsChangesEvent;
import ru.partyfinder.organizerprofile.messaging.producer.CredentialsChangesEventProducer;
import ru.partyfinder.organizerprofile.model.dto.request.PutNewRatingDto;
import ru.partyfinder.organizerprofile.service.OrganizerService;

import java.util.UUID;

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
