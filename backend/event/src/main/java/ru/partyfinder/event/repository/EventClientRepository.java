package ru.partyfinder.event.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ru.partyfinder.event.entity.EventClientEntity;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface EventClientRepository extends JpaRepository<EventClientEntity, UUID> {

    List<EventClientEntity> getAllByClientId(UUID clientId);

    Optional<EventClientEntity> findByClientIdAndEventId(UUID clientId, UUID eventId);

}
