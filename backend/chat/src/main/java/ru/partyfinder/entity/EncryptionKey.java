package ru.partyfinder.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.GenericGenerator;
import java.util.UUID;

@Getter
@Setter
@Entity
@Table(name = "encryption_key", schema = "client")
public class EncryptionKey {
    @Id
    @GeneratedValue(generator = "UUID")
    @GenericGenerator(name = "UUID", strategy = "org.hibernate.id.UUIDGenerator")
    @Column(name = "id", nullable = false)
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "sender_id", nullable = false)
    private Profile sender;

    @ManyToOne
    @JoinColumn(name = "receiver_id", nullable = false)
    private Profile receiver;

    @Column(name = "key", nullable = false)
    private String key;
}