package ru.partyfinder.model.dto;

import lombok.Getter;
import lombok.Setter;
import java.time.Instant;

@Getter
@Setter
public class MediaDTO {
    private Long id;
    private String fileName;
    private String mimeType;
    private String fileData;
    private Instant createdTime;
}
