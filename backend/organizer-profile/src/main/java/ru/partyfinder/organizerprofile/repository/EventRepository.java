package ru.partyfinder.organizerprofile.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import ru.partyfinder.organizerprofile.entity.EventEntity;

import java.util.UUID;

public interface EventRepository extends JpaRepository<EventEntity, UUID> {

    @Modifying
    @Query("""
        update EventEntity e
        set e.status = :status
        where e.id = :id
        """)
    int endEvent(@Param("id") UUID id, @Param("status") String status);

}
