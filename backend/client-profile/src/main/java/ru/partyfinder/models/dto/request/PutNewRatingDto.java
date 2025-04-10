package ru.partyfinder.models.dto.request;

import lombok.Data;

import java.math.BigDecimal;
import java.util.UUID;

@Data
public class PutNewRatingDto {
    UUID entityId;
    String entityType;
    BigDecimal rating;
}
