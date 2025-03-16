package ru.partyfinder.organizerprofile.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ru.partyfinder.organizerprofile.entity.EventEntity;
import ru.partyfinder.organizerprofile.service.EventService;

import java.util.UUID;

@RestController
@RequestMapping("/api/organizer-profile/event")
@RequiredArgsConstructor
public class EventController {

    private final EventService eventService;

    @PostMapping
    public ResponseEntity<UUID> create(@RequestBody EventEntity event) {
        return ResponseEntity.ok(eventService.createEvent(event));
    }

    @GetMapping("/{id}")
    public ResponseEntity<EventEntity> get(@PathVariable UUID id) {
        return ResponseEntity.ok(eventService.getEvent(id));
    }

    @PatchMapping("/cancel/{uuid}")
    public ResponseEntity<Integer> cancel(@PathVariable UUID uuid) {
        return ResponseEntity.ok(eventService.endEvent(uuid));
    }

    @PatchMapping("/update/{eventId}")
    public ResponseEntity<EventEntity> update(@PathVariable UUID eventId, @RequestBody EventEntity event) {
        return ResponseEntity.ok(eventService.updateEvent(eventId, event));
    }
}
