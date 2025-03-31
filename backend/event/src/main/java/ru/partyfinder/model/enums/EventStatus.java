package ru.partyfinder.model.enums;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum EventStatus {

    COMPLETED("COMPLETED", "Прошедшие мероприятия"),
    CANCELLED("CANCELLED", "Отмененные мероприятия"),
    ONGOING("ONGOING", "Мероприятие идушие сейчас"),
    UPCOMING("UPCOMING", "Будущие мероприятия");

    private final String value;
    private final String name;
}
