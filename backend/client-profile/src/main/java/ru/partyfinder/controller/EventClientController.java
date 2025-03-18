package ru.partyfinder.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.partyfinder.entity.EventClientEntity;
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

    /*@GetMapping("/getEvent")
    public ResponseEntity<EventClientEntity> getSubscribeEventByProfileIdAndEventId(@RequestParam UUID clientId,
                                                                                    @RequestParam UUID eventId) {
        return ResponseEntity.ok(eventClientService.getEventSubscribeByClientIdSndEventId(clientId, eventId));
    }

    @GetMapping("/getEvents/{id}")
    public ResponseEntity<List<EventClientEntity>> getUserSubscribes(@PathVariable UUID id) {
        return ResponseEntity.ok(eventClientService.getEventsSubscribeByClientId(id));
    }*/

    @PatchMapping("/cancelEvent")
    public void deleteUserSubscribe(@RequestParam String username,
                                                 @RequestParam UUID eventId) {
        eventClientService.deleteEventSubscribeByClientIdSndEventId(username, eventId);
    }
}
