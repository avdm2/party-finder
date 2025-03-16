package ru.partyfinder.organizerprofile.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ru.partyfinder.organizerprofile.messaging.event.CredentialsChangesEvent;
import ru.partyfinder.organizerprofile.messaging.producer.CredentialsChangesEventProducer;

@RestController
@RequestMapping("/api/v1/organizer")
@RequiredArgsConstructor
public class OrganizerController {

    private final CredentialsChangesEventProducer credentialsChangesEventProducer;

    @PostMapping("/credentials/update")
    public ResponseEntity<Void> produce(@RequestBody CredentialsChangesEvent payload) {
        credentialsChangesEventProducer.produce(payload);
        return ResponseEntity.ok().build();
    }
}
