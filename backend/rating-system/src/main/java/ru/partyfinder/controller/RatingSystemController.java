package ru.partyfinder.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import ru.partyfinder.model.dto.NewRatingRequest;
import ru.partyfinder.model.enums.EntityTypes;
import ru.partyfinder.service.RatingSystemService;

import java.math.BigDecimal;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/ratingSystem")
@RequiredArgsConstructor
public class RatingSystemController {

    private final RatingSystemService ratingSystemService;

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    @GetMapping
    public ResponseEntity<String> countRatings() {
        return ResponseEntity.ok(ratingSystemService.countRatings());
    }

    private final RatingSystemService ratingService;

    @GetMapping("/client/{clientProfileId}")
    public ResponseEntity<BigDecimal> getClientRating(@PathVariable UUID clientProfileId) {
        return ResponseEntity.ok(ratingService.getRating(clientProfileId, EntityTypes.PARTICIPANT));
    }

    @GetMapping("/organizer/{organizerProfileId}")
    public ResponseEntity<BigDecimal> getOrganizerRating(@PathVariable UUID organizerProfileId) {
        return ResponseEntity.ok(ratingService.getRating(organizerProfileId, EntityTypes.ORGANIZER));
    }

    @GetMapping("/event/{eventId}")
    public ResponseEntity<BigDecimal> getEventRating(@PathVariable UUID eventId) {
        return ResponseEntity.ok(ratingService.getRating(eventId, EntityTypes.EVENT));
    }

    @PostMapping("/putRating")
    public ResponseEntity<Long> putRating(@RequestBody NewRatingRequest newRatingRequest) {
        return ResponseEntity.ok(ratingService.setNewRatingForCalc(newRatingRequest));
    }
}
