package ru.partyfinder.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ru.partyfinder.entity.RatingEntity;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface RatingRepository extends JpaRepository<RatingEntity, Long> {

    Optional<RatingEntity> findByEntityIdAndEntityType(UUID clientProfileId, String entityType);
}
