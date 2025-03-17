package ru.partyfinder.event.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;

import java.time.Instant;
import java.util.UUID;

@Getter
@Setter
@Entity
@Table(name = "event_client", schema = "organizer")
public class EventClientEntity {
    @Id
    @ColumnDefault("gen_random_uuid()")
    @Column(name = "id", nullable = false)
    private UUID id;

    @Column(name = "event_id", nullable = false)
    private UUID eventId;

    @Column(name = "client_id", nullable = false)
    private UUID clientId;

    @Column(name = "created_time")
    private Instant createdTime;

    @PrePersist
    void prePersist() {
        this.createdTime = Instant.now();
    }

}
