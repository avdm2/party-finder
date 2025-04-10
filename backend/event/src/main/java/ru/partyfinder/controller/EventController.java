package ru.partyfinder.controller;


import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;
import ru.partyfinder.entity.EventEntity;
import ru.partyfinder.model.dto.PutNewRatingDto;
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

    @PostMapping("/putNewRating")
    public void putNewRating(@RequestBody PutNewRatingDto putNewRatingDto) {
        eventService.putNewRating(putNewRatingDto);
    }
}
