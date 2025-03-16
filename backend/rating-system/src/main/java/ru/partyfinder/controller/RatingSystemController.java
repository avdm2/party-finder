package ru.partyfinder.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import ru.partyfinder.service.RatingSystemService;

import java.math.BigDecimal;

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
}
