package ru.partyfinder.event.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import ru.partyfinder.event.entity.EventEntity;

import java.util.UUID;

public interface EventRepository extends JpaRepository<EventEntity, UUID> {

    @Modifying
    @Query("""
        update EventEntity e
        set e.status = :status
        where e.id = :id
        """)
    int endEvent(@Param("id") UUID id, @Param("status") String status);

    @Modifying
    @Query("""
            update EventEntity e
            set e.address = case when :address IS NOT NULL then :address ELSE e.address END,
                e.age = case when :age IS NOT NULL then :age ELSE e.age END,
                e.capacity = case when :capacity IS NOT NULL then :capacity ELSE e.capacity END,
                e.dateOfEvent = case when :dateOfEvent IS NOT NULL then :dateOfEvent ELSE e.dateOfEvent END,
                e.description = case when :description IS NOT NULL then :description ELSE e.description END,
                e.price = case when :price IS NOT NULL then :price ELSE e.price END,
                e.status = case when :status IS NOT NULL then :status ELSE e.status END,
                e.title = case when :title IS NOT NULL then :title ELSE e.title END
            where e.id = :id
            """)
    int updateEvent(UUID id, EventEntity event);

}
