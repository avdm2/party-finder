package ru.partyfinder.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.partyfinder.entity.RatingEntity;
import ru.partyfinder.model.dto.AverageScoresDTO;
import ru.partyfinder.repository.NewRatingRepository;
import ru.partyfinder.repository.RatingRepository;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class RatingSystemService {

    private final NewRatingRepository newRatingRepository;
    private final RatingRepository ratingRepository;

    public String countRatings() {
        log.info("Начинаем расчет средних значений...");

        List<AverageScoresDTO> averageScores = newRatingRepository.findAverageScores();

        List<RatingEntity> ratingsToUpdateOrSave = new ArrayList<>();

        for (AverageScoresDTO result : averageScores) {
            String entityType = result.getEntityType();
            UUID entityId = result.getEntityId();
            BigDecimal newScore = result.getAvgScore();

            Optional<RatingEntity> existingRating = ratingRepository.findByEntityTypeAndEntityId(entityType, entityId);

            if (existingRating.isPresent()) {
                RatingEntity rating = existingRating.get();
                BigDecimal currentScore = rating.getScore();

                BigDecimal updatedScore = calculateUpdatedAverage(currentScore, newScore);

                rating.setScore(updatedScore);
                rating.setCreatedTime(java.time.Instant.now());

                ratingsToUpdateOrSave.add(rating);
                log.info("Добавлен на обновление: " + entityType + ", " + entityId + ". Новое значение: " + updatedScore);
            } else {
                RatingEntity rating = new RatingEntity();
                rating.setEntityType(entityType);
                rating.setEntityId(entityId);
                rating.setScore(newScore);
                rating.setCreatedTime(java.time.Instant.now());

                ratingsToUpdateOrSave.add(rating);
                log.info("Добавлен на создание: " + entityType + ", " + entityId + ". Значение: " + newScore);
            }

            newRatingRepository.markAsProcessed(entityType, entityId);
        }

        ratingRepository.saveAll(ratingsToUpdateOrSave);

        log.info("Расчет средних значений завершен. Сохранено {} записей.", ratingsToUpdateOrSave.size());
        return "Подсчитаны рейтинги";
    }

    /**
     * Рассчитывает новое среднее значение между текущим и новым значением.
     *
     * @param currentScore Текущее значение рейтинга
     * @param newScore     Новое значение рейтинга
     * @return Новое среднее значение
     */
    private BigDecimal calculateUpdatedAverage(BigDecimal currentScore, BigDecimal newScore) {
        return currentScore.add(newScore).divide(BigDecimal.valueOf(2));
    }
}