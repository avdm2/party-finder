package ru.partyfinder.controller;


import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;
import ru.partyfinder.service.EventStatusesCulculateService;

@RestController
@AllArgsConstructor
public class EventStatusesCulculateController {

    private final EventStatusesCulculateService eventStatusesCulculateService;
    @GetMapping
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public ResponseEntity<String> calculateStatues() {
        return ResponseEntity.ok(eventStatusesCulculateService.calculateStatues());
    }
}
