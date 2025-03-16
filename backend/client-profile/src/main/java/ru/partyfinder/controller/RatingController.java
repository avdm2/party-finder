package ru.partyfinder.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.partyfinder.models.dto.request.NewRatingRequest;
import ru.partyfinder.service.RatingService;

import java.math.BigDecimal;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/client/rating")
@RequiredArgsConstructor
public class RatingController {

    private static final String ENTITY_TYPE = "PROFILE";
    private final RatingService ratingService;

    @GetMapping("/{clientProfileId}")
    public ResponseEntity<BigDecimal> rating(@PathVariable UUID clientProfileId) {
        return ResponseEntity.ok(ratingService.getRating(clientProfileId, ENTITY_TYPE));
    }

    @PostMapping("/putRating")
    public ResponseEntity<Long> putRating(@RequestBody NewRatingRequest newRatingRequest) {
        return ResponseEntity.ok(ratingService.setNewRatingForCalc(newRatingRequest, ENTITY_TYPE));
    }
}
