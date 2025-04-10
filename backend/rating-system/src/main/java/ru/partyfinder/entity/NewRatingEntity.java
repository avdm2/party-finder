package ru.partyfinder.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Getter
@Setter
@Entity
@Table(name = "new_ratings", schema = "source")
public class NewRatingEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "entity_type", nullable = false)
    private String entityType;

    @Column(name = "entity_id", nullable = false)
    private UUID entityId;

    @Column(name = "sender_entity_type", nullable = false)
    private String senderEntityType;

    @Column(name = "sender_entity_id", nullable = false)
    private UUID senderEntityId;

    @Column(name = "score", nullable = false)
    private BigDecimal score;

    @Column(name = "comment", nullable = false)
    private String comment;

    @Column(name = "created_time", nullable = false)
    private Instant createdTime;

    @Column(name = "processed", nullable = false)
    private Boolean processed;

    @PrePersist
    protected void onCreate() {
        this.createdTime = Instant.now();
        if (this.processed == null) {
            this.processed = false;
        }
    }
}