package ru.partyfinder.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import ru.partyfinder.entity.RatingEntity;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface RatingRepository extends JpaRepository<RatingEntity, Long> {

    Optional<RatingEntity> findByEntityTypeAndEntityId(String entityType, UUID entityId);

}
