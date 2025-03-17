package ru.partyfinder.event.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ru.partyfinder.event.entity.EventEntity;
import ru.partyfinder.event.service.EventOrganizerService;

import java.util.UUID;

@RestController
@RequestMapping("/api/organizers/event")
@RequiredArgsConstructor
public class EventOrganizerController {

    private final EventOrganizerService eventOrganizerService;

    @PostMapping
    public ResponseEntity<UUID> create(@RequestBody EventEntity event) {
        return ResponseEntity.ok(eventOrganizerService.createEvent(event));
    }

    @GetMapping("/{id}")
    public ResponseEntity<EventEntity> get(@PathVariable UUID id) {
        return ResponseEntity.ok(eventOrganizerService.getEvent(id));
    }

    @PatchMapping("/cancel/{uuid}")
    public ResponseEntity<Integer> cancel(@PathVariable UUID uuid) {
        return ResponseEntity.ok(eventOrganizerService.endEvent(uuid));
    }

    @PatchMapping("/update/{eventId}")
    public ResponseEntity<EventEntity> update(@PathVariable UUID eventId, @RequestBody EventEntity event) {
        return ResponseEntity.ok(eventOrganizerService.updateEvent(eventId, event));
    }
}
