package ru.partyfinder.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import ru.partyfinder.entity.EventEntity;

import java.util.List;
import java.util.UUID;

public interface EventRepository extends JpaRepository<EventEntity, UUID> {
    @Query(value = "select ei.* from organizer.event_instance ei " +
            "join organizer.event_client ec on ei.id = ec.event_id " +
            "where ec.username = :username", nativeQuery = true)
    List<EventEntity> getAllByUsername(String username);
}
