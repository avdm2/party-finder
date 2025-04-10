package ru.partyfinder.organizerprofile.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import ru.partyfinder.organizerprofile.repository.RatingRepository;

import java.math.BigDecimal;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class RatingService {

    private final RatingRepository ratingRepository;

    @SuppressWarnings("OptionalGetWithoutIsPresent")
    public BigDecimal getRating(UUID organizerId, String entityType) {
        return ratingRepository.findByEntityIdAndEntityType(organizerId, entityType)
                .orElseThrow(() -> new IllegalArgumentException("Ничего не найдено")).getScore();
    }

}
