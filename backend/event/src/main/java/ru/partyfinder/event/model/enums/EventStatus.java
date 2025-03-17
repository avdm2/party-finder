package ru.partyfinder.event.model.enums;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum EventStatus {

    COMPLETED("COMPLETED"),
    CANCELLED("CANCELLED"),
    ONGOING("ONGOING"),
    UPCOMING("UPCOMING");

    private final String value;
}
