package ru.partyfinder.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ru.partyfinder.entity.EventEntity;

import java.util.UUID;

public interface EventRepository extends JpaRepository<EventEntity, UUID> {
}
