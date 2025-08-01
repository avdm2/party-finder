package ru.partyfinder.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.util.Base64;
import java.time.Instant;

@Getter
@Setter
@Entity
@Table(name = "media", schema = "client")
public class Media {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "file_name", nullable = false)
    private String fileName;

    @Column(name = "mime_type", nullable = false)
    private String mimeType;

    @Column(name = "file_data", nullable = false, columnDefinition = "bytea")
    private byte[] fileData;

    @Column(name = "created_time", nullable = false)
    private Instant createdTime;

    @PrePersist
    protected void onCreate() {
        if (this.createdTime == null) {
            this.createdTime = Instant.now();
        }
    }
}