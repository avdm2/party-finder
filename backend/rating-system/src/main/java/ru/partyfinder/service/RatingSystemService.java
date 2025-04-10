package ru.partyfinder.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.partyfinder.config.UserContextHolder;
import ru.partyfinder.config.UserRequest;
import ru.partyfinder.entity.NewRatingEntity;
import ru.partyfinder.entity.RatingEntity;
import ru.partyfinder.model.dto.AverageScoresDTO;
import ru.partyfinder.model.dto.NewRatingRequest;
import ru.partyfinder.model.dto.PutNewRatingDto;
import ru.partyfinder.model.enums.EntityTypes;
import ru.partyfinder.repository.NewRatingRepository;
import ru.partyfinder.repository.RatingRepository;

import java.math.BigDecimal;
import java.util.*;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class RatingSystemService {

    private final NewRatingRepository newRatingRepository;
    private final RatingRepository ratingRepository;
    private final RatingSenderHttpService ratingSenderHttpService;


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
                rating.setScore(newScore);
                rating.setCreatedTime(java.time.Instant.now());

                ratingsToUpdateOrSave.add(rating);
                log.info("Добавлен на обновление: " + entityType + ", " + entityId + ". Новое значение: " + newScore);

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

        for (RatingEntity rating : ratingsToUpdateOrSave) {
            PutNewRatingDto putNewRatingDto = new PutNewRatingDto();
            putNewRatingDto.setEntityId(rating.getEntityId());
            putNewRatingDto.setEntityType(rating.getEntityType());
            putNewRatingDto.setRating(rating.getScore());
            putNewRating(putNewRatingDto);
        }

        log.info("Расчет средних значений завершен. Сохранено {} записей.", ratingsToUpdateOrSave.size());
        return "Подсчитаны рейтинги";
    }

    public BigDecimal getRating(UUID id, EntityTypes entityType) {
        return ratingSenderHttpService.getRating(id, entityType);
    }

    private void putNewRating(PutNewRatingDto putNewRatingDto) {
        ratingSenderHttpService.putRating(putNewRatingDto);
    }

    public Long setNewRatingForCalc(NewRatingRequest newRatingRequest) {
        UserRequest userContext = UserContextHolder.getContext();
        if (userContext != null) {
            String username = userContext.getUsername();
            UUID senderEntityId = getEntityId(username, newRatingRequest.getSenderEntityType());
            NewRatingEntity newRatingEntity = new NewRatingEntity();
            if (checkNewRatingRequest(newRatingRequest)) {
                newRatingEntity.setSenderEntityId(senderEntityId);
                newRatingEntity.setSenderEntityType(newRatingRequest.getSenderEntityType());
                newRatingEntity.setEntityType(newRatingRequest.getReceiveEntityType());
                newRatingEntity.setEntityId(newRatingRequest.getReceiveEntityId());
                newRatingEntity.setScore(newRatingRequest.getScore());
                newRatingEntity.setComment(newRatingRequest.getComment());
                return newRatingRepository.save(newRatingEntity).getId();
            } else {
                throw new IllegalArgumentException("Нет такой сущности для оценки");
            }
        } else {
            throw new RuntimeException("Не произошла авторизация! (User context = null)");
        }

    }

    private boolean checkNewRatingRequest(NewRatingRequest newRatingRequest) {
        return ratingSenderHttpService.isEntityExist(newRatingRequest.getReceiveEntityId(), newRatingRequest.getReceiveEntityType());
    }

    private UUID getEntityId(String username, String entityType) {
        return ratingSenderHttpService.getEntityIdRequest(username, entityType);
    }
}