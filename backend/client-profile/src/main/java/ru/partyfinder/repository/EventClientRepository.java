package ru.partyfinder.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import ru.partyfinder.entity.EventClientEntity;
import ru.partyfinder.entity.EventEntity;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface EventClientRepository extends JpaRepository<EventClientEntity, UUID> {
    Optional<EventClientEntity> findByUsernameAndEventId(String username, UUID eventId);

    @Query(
    value = """
    select ec.username from organizer.event_client ec 
    where ec.event_id  = :eventId
    """
    ,nativeQuery = true)
    List<String> getSubscribers(UUID eventId);

}
