package ru.partyfinder.model.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class EventDTO {
    private UUID id;

    private UUID organizerId;

    private String title;

    private String description;

    private LocalDateTime dateOfEvent;

    private String address;

    private String status;

    private BigDecimal price;

    private Integer capacity;

    private Integer age;

    private BigDecimal rating;
}
