package ru.partyfinder.organizerprofile.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import ru.partyfinder.organizerprofile.entity.RatingEntity;
import ru.partyfinder.organizerprofile.repository.RatingRepository;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class RatingService {

    private final RatingRepository ratingRepository;

    @SuppressWarnings("OptionalGetWithoutIsPresent")
    public Double getRating(UUID organizerId) {
        return ratingRepository.findAllByOrganizerId(organizerId)
                .stream()
                .mapToDouble(RatingEntity::getRating)
                .average()
                .getAsDouble();
    }

}
