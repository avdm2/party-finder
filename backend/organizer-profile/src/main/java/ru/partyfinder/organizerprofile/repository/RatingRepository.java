package ru.partyfinder.organizerprofile.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ru.partyfinder.organizerprofile.entity.RatingEntity;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface RatingRepository extends JpaRepository<RatingEntity, Long> {

    Optional<RatingEntity> findByEntityIdAndEntityType(UUID organizerId, String entityType);
}
