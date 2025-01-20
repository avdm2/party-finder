package ru.partyfinder.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;

import java.time.Instant;
import java.util.UUID;

@Getter
@Setter
@Entity
@Table(name = "profile", schema = "client")
public class Profile {
    @Id
    @ColumnDefault("gen_random_uuid()")
    @Column(name = "id", nullable = false)
    private UUID id;

    @OneToOne
    @JoinColumn(name = "cient_id")
    private Client client;

    @Column(name = "is_confirmed", nullable = false)
    private Boolean is_confirmed;

    @Column(name = "created_time", nullable = false)
    private Instant created_time;

    @Column(name = "updated_time", nullable = false)
    private Instant updated_time;

    @PrePersist
    protected void prePersist() {
        created_time = Instant.now();
        updated_time = Instant.now();
        is_confirmed = false;
    }
}
