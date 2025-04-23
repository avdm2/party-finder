package ru.partyfinder.controller;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.partyfinder.entity.EventClientEntity;
import ru.partyfinder.entity.EventEntity;
import ru.partyfinder.models.dto.SubscribeEventDTO;
import ru.partyfinder.service.EventClientService;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/clients/eventSubscribe")
@RequiredArgsConstructor
public class EventClientController {

    private final EventClientService eventClientService;

    @PostMapping("/create")
    public ResponseEntity<UUID> createUserSubscribe(@RequestBody SubscribeEventDTO subscribeEventDTO) {
        return ResponseEntity.ok(eventClientService.subscribeEvent(subscribeEventDTO));
    }

    @PostMapping("/isAttend")
    public ResponseEntity<Boolean> isAttend(@RequestBody SubscribeEventDTO subscribeEventDTO) {
        return ResponseEntity.ok(eventClientService.isAttend(subscribeEventDTO));
    }

    @GetMapping("/getAllEventsByUsername")
    public ResponseEntity<List<EventEntity>> getAllEventsByUsername(@RequestParam String username) {
        return ResponseEntity.ok(eventClientService.getEventsSubscribeByUsername(username));
    }
    @PatchMapping("/cancelEvent")
    public void deleteUserSubscribe(@RequestParam String username,
                                                 @RequestParam UUID eventId) {
        eventClientService.deleteEventSubscribeByClientIdSndEventId(username, eventId);
    }
}
