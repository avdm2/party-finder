package ru.partyfinder.organizerprofile.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ru.partyfinder.organizerprofile.entity.OrganizerEntity;

import java.util.Optional;
import java.util.UUID;

public interface OrganizerRepository extends JpaRepository<OrganizerEntity, UUID> {

    Optional<OrganizerEntity> findByUsername(String username);
}
