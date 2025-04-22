package ru.partyfinder.organizerprofile.repository;

import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import ru.partyfinder.organizerprofile.entity.EventEntity;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

public interface EventRepository extends JpaRepository<EventEntity, UUID> {

    @Modifying
    @Transactional
    @Query("""
        update EventEntity e
        set e.status = :status
        where e.id = :id
        """)
    int updStatus(@Param("id") UUID id, @Param("status") String status);

    @Modifying
    @Transactional
    @Query("""
           update EventEntity e
           set e.address = COALESCE(:address, e.address),
           e.age = COALESCE(:age, e.age),
           e.capacity = COALESCE(:capacity, e.capacity),
           e.dateOfEvent = COALESCE(:dateOfEvent, e.dateOfEvent),
           e.description = COALESCE(:description, e.description),
           e.price = COALESCE(:price, e.price),
           e.status = COALESCE(:status, e.status),
           e.title = COALESCE(:title, e.title)
           where e.id = :id
           """)
    int updateEvent(
            @Param("id") UUID id,
            @Param("address") String address,
            @Param("age") Integer age,
            @Param("capacity") Integer capacity,
            @Param("dateOfEvent") LocalDateTime dateOfEvent,
            @Param("description") String description,
            @Param("price") BigDecimal price,
            @Param("status") String status,
            @Param("title") String title
    );

}
