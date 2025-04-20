package ru.partyfinder.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.GenericGenerator;
import java.time.Instant;
import java.util.UUID;

@Getter
@Setter
@Entity
@Table(name = "message", schema = "client")
public class Message {
    @Id
    @GeneratedValue(generator = "UUID")
    @GenericGenerator(name = "UUID", strategy = "org.hibernate.id.UUIDGenerator")
    @Column(name = "id", nullable = false)
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "chat_id", nullable = false)
    private Chat chat;

    @ManyToOne
    @JoinColumn(name = "sender_id", nullable = false)
    private Profile sender;

    @ManyToOne
    @JoinColumn(name = "receiver_id", nullable = false)
    private Profile receiver;

    @Column(name = "content")
    private String content;

    @Column(name = "encrypted_content")
    private String encryptedContent;

    @Column(name = "sent_time", nullable = false)
    private Instant sentTime;

    @PrePersist
    protected void prePersist() {
        sentTime = Instant.now();
    }
}