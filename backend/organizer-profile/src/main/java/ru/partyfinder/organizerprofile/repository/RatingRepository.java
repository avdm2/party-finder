package ru.partyfinder.organizerprofile.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ru.partyfinder.organizerprofile.entity.RatingEntity;

import java.util.List;
import java.util.UUID;

public interface RatingRepository extends JpaRepository<RatingEntity, Long> {

    List<RatingEntity> findAllByOrganizerId(UUID organizerId);
}
