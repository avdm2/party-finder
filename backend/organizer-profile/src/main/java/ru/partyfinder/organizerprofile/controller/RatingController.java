package ru.partyfinder.organizerprofile.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ru.partyfinder.organizerprofile.service.RatingService;

import java.math.BigDecimal;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/organizer/rating")
@RequiredArgsConstructor
public class RatingController {

    private static final String ENTITY_TYPE = "ORGANIZER";
    private final RatingService ratingService;

    @GetMapping("/{organizerId}")
    public ResponseEntity<BigDecimal> rating(@PathVariable UUID organizerId) {
        return ResponseEntity.ok(ratingService.getRating(organizerId, ENTITY_TYPE));
    }
}
