package ru.partyfinder.auth.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ru.partyfinder.auth.entity.OrganizerUserDetails;

import java.util.Optional;
import java.util.UUID;

public interface OrganizerRepository extends JpaRepository<OrganizerUserDetails, UUID> {

    Optional<OrganizerUserDetails> findByUsername(String username);
}
