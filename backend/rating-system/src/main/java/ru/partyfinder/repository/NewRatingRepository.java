package ru.partyfinder.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import ru.partyfinder.entity.NewRatingEntity;
import ru.partyfinder.model.dto.AverageScoresDTO;

import java.util.List;
import java.util.UUID;

@Repository
public interface NewRatingRepository extends JpaRepository<NewRatingEntity, Long> {

    @Query(nativeQuery = true, name = "findAverageScores")
    List<AverageScoresDTO> findAverageScores();

    @Transactional
    @Modifying
    @Query("UPDATE NewRatingEntity nr " +
            "SET nr.processed = true " +
            "WHERE nr.entityType = :entityType AND nr.entityId = :entityId AND nr.processed = false")
    void markAsProcessed(String entityType, UUID entityId);
}