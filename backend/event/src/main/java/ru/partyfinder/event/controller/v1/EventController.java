package ru.partyfinder.event.controller.v1;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import ru.partyfinder.event.models.dto.EventDTO;
import ru.partyfinder.event.service.EventService;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/event-service/event")
@RequiredArgsConstructor
public class EventController {

    private final EventService eventService;

    @PostMapping
    public UUID createEvent(@RequestBody EventDTO eventDTO) {
        return eventService.createEvent(eventDTO);
    }

    @GetMapping("/{id}")
    public EventDTO getEvent(@PathVariable UUID id) {
        return eventService.getEvent(id);
    }
}
