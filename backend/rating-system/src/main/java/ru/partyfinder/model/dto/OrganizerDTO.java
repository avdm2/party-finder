package ru.partyfinder.model.dto;

import lombok.Data;
import ru.partyfinder.entity.Media;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class OrganizerDTO {

    private UUID id;

    private String name;

    private String surname;

    private LocalDateTime birthday;

    private String username;

    private BigDecimal rating;

    private Media media;
}
