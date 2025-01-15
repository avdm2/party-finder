package ru.partyfinder.auth.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ru.partyfinder.auth.entity.ParticipantUserDetails;

import java.util.Optional;
import java.util.UUID;

public interface ParticipantRepository extends JpaRepository<ParticipantUserDetails, UUID> {

    Optional<ParticipantUserDetails> findByUsername(String username);
}
