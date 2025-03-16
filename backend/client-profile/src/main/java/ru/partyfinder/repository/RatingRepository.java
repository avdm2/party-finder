package ru.partyfinder.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ru.partyfinder.entity.RatingEntity;

import java.util.Optional;
import java.util.UUID;

public interface RatingRepository extends JpaRepository<RatingEntity, Long> {

    Optional<RatingEntity> findByEntityIdAndEntityType(UUID clientProfileId, String entityType);
}
