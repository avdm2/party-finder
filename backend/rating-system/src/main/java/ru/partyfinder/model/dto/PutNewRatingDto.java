package ru.partyfinder.model.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.util.UUID;

@Data
public class PutNewRatingDto {
    UUID entityId;
    String entityType;
    BigDecimal rating;

    @Override
    public String toString() {
        return "PutNewRatingDto{" +
                "entityId=" + entityId +
                ", entityType='" + entityType + '\'' +
                ", rating=" + rating +
                '}';
    }
}
