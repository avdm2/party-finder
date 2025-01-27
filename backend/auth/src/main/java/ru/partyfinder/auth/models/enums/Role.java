package ru.partyfinder.auth.models.enums;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum Role {

    ORGANIZER("ORGANIZER"),
    PARTICIPANT("PARTICIPANT");

    private final String value;
}
