package ru.partyfinder.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ru.partyfinder.entity.EventClientEntity;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface EventClientRepository extends JpaRepository<EventClientEntity, UUID> {

    List<EventClientEntity> getAllByUsername(String username);

    Optional<EventClientEntity> findByUsernameAndEventId(String username, UUID eventId);

}
