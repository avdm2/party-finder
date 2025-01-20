package ru.partyfinder.auth.models.enums;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum Role {

    ORGANIZER("ROLE_ORGANIZER"),
    PARTICIPANT("ROLE_PARTICIPANT");

    private final String value;
}
