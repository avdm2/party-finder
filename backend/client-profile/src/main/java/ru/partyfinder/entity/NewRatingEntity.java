package ru.partyfinder.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
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

    @Column(name = "score", nullable = false, columnDefinition = "DECIMAL(3, 2) CHECK (score BETWEEN 0.00 AND 5.00)")
    private BigDecimal score;

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