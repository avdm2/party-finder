package ru.partyfinder.model.dto;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.UUID;

@Getter
@Setter
public class NewRatingRequest {
    UUID receiveEntityId;
    String receiveEntityType;
    String senderEntityType;
    BigDecimal score;
    String comment;
}

