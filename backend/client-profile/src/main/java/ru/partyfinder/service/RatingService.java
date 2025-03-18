package ru.partyfinder.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import ru.partyfinder.entity.NewRatingEntity;
import ru.partyfinder.models.dto.request.NewRatingRequest;
import ru.partyfinder.repository.NewRatingRepository;
import ru.partyfinder.repository.RatingRepository;

import java.math.BigDecimal;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class RatingService {

    private final RatingRepository ratingRepository;
    private final NewRatingRepository newRatingRepository;
    private final ProfileService profileService;
    @SuppressWarnings("OptionalGetWithoutIsPresent")
    public BigDecimal getRating(UUID clientProfileId, String entityType) {
        return ratingRepository.findByEntityIdAndEntityType(clientProfileId, entityType)
                .orElseThrow(
                        () -> new IllegalArgumentException("Ничего не найдено")

                ).getScore();
    }

    @SuppressWarnings("OptionalGetWithoutIsPresent")
    public Long setNewRatingForCalc(NewRatingRequest newRatingRequest, String entityType) {
        NewRatingEntity newRatingEntity = new NewRatingEntity();
        if (checkNewRatingRequest(newRatingRequest)) {
            newRatingEntity.setEntityType(entityType);
            newRatingEntity.setEntityId(newRatingRequest.getEntityId());
            newRatingEntity.setScore(newRatingRequest.getScore());
            return newRatingRepository.save(newRatingEntity).getId();
        } else {
            throw new IllegalArgumentException("Нет такой сущности для оценки");
        }
    }

    private boolean checkNewRatingRequest(NewRatingRequest newRatingRequest) {
        return profileService.getProfile(newRatingRequest.getEntityId()).getId() != null;
    }
}
