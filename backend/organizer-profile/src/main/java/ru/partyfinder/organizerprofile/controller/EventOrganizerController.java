package ru.partyfinder.organizerprofile.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.partyfinder.organizerprofile.entity.EventEntity;
import ru.partyfinder.organizerprofile.service.EventOrganizerService;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/organizers/event")
@RequiredArgsConstructor
@Slf4j
public class EventOrganizerController {

    private final EventOrganizerService eventOrganizerService;

    @PostMapping
    public ResponseEntity<UUID> create(@RequestBody EventEntity event) {
        log.info("Create event: {}", event);
        return ResponseEntity.ok(eventOrganizerService.createEvent(event));
    }

    @GetMapping("/{id}")
    public ResponseEntity<EventEntity> get(@PathVariable UUID id) {
        return ResponseEntity.ok(eventOrganizerService.getEvent(id));
    }

    @PutMapping("/cancel/{uuid}")
    public ResponseEntity<Integer> cancel(@PathVariable UUID uuid) {
        return ResponseEntity.ok(eventOrganizerService.endEvent(uuid));
    }

    @PutMapping("/complete/{uuid}")
    public ResponseEntity<Integer> complete(@PathVariable UUID uuid) {
        return ResponseEntity.ok(eventOrganizerService.completeEvent(uuid));
    }

    @PutMapping("/update/{eventId}")
    public ResponseEntity<EventEntity> update(@PathVariable UUID eventId, @RequestBody EventEntity event) {
        log.info("Updating event: {}", event);
        return ResponseEntity.ok(eventOrganizerService.updateEvent(eventId, event));
    }

    @GetMapping("/list/{id}")
    public ResponseEntity<List<EventEntity>> list(@PathVariable UUID id) {
        return ResponseEntity.ok(eventOrganizerService.getAll(id));
    }
}
