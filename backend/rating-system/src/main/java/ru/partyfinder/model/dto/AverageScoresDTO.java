package ru.partyfinder.model.dto;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.UUID;

@Getter
@Setter
public class AverageScoresDTO {
    String entityType;

    UUID entityId;

    BigDecimal avgScore;

}
