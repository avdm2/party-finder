package ru.partyfinder.models.dto.request;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.UUID;

@Getter
@Setter
public class NewRatingRequest {
    String username;
    BigDecimal score;
}
