package ru.partyfinder.model.enums;

public enum EntityTypes {
    PROFILE("PROFILE"),
    ORGANIZER("ORGANIZER"),
    EVENT("EVENT");

    private final String type;

    EntityTypes(String type) {
        this.type = type;
    }
}
