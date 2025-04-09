package ru.partyfinder.model.enums;

public enum EntityTypes {
    PARTICIPANT("PARTICIPANT"),
    ORGANIZER("ORGANIZER"),
    EVENT("EVENT");

    private final String type;

    EntityTypes(String type) {
        this.type = type;
    }
}
