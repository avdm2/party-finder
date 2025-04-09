package ru.partyfinder.controller;


import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ru.partyfinder.entity.EventEntity;
import ru.partyfinder.service.EventService;

import java.util.UUID;

@RestController
@AllArgsConstructor
@RequestMapping("/api/v1/event/")
public class EventController {

    private final EventService eventService;
    @GetMapping("id/{eventId}")
    public EventEntity getEvent(@PathVariable UUID eventId) {
        return eventService.getEvent(eventId);
    }
}
