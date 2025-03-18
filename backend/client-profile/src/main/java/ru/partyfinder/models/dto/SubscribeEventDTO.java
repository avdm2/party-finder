package ru.partyfinder.models.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
public class SubscribeEventDTO {
    UUID eventId;
    String username;
}
