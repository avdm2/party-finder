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
@Table(name = "rating", schema = "source")
public class RatingEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "entity_type", nullable = false)
    private String entityType;

    @Column(name = "entity_id", nullable = false)
    private UUID entityId;

    @Column(name = "score", nullable = false, columnDefinition = "DECIMAL(3, 2) CHECK (score BETWEEN 0.00 AND 5.00)")
    private BigDecimal score;

    @Column(name = "created_time", nullable = false)
    private Instant createdTime;

    @PrePersist
    protected void onCreate() {
        this.createdTime = Instant.now();
    }
}
