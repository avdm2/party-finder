package ru.partyfinder.event.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ru.partyfinder.event.entity.EventEntity;

import java.util.UUID;

public interface EventRepository extends JpaRepository<EventEntity, UUID> {
}
